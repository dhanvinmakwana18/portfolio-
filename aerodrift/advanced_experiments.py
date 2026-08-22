import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    f1_score, precision_score, recall_score, roc_auc_score, 
    average_precision_score, brier_score_loss, confusion_matrix
)
from sklearn.cluster import KMeans
import shap
import json
import os
import time

def load_dataset(fd_name):
    """
    Loads train, test, and RUL files for a specific C-MAPSS sub-dataset (FD001, FD002, FD003, FD004).
    Calculates exact true RUL without data leakage.
    """
    train_path = f"train_{fd_name}.txt"
    test_path = f"test_{fd_name}.txt"
    rul_path = f"RUL_{fd_name}.txt"
    
    columns = ['machine_id', 'cycle', 'setting_1', 'setting_2', 'setting_3'] + [f'sensor_{i}' for i in range(1, 22)]
    
    train_df = pd.read_csv(train_path, sep=r'\s+', header=None, names=columns)
    test_df = pd.read_csv(test_path, sep=r'\s+', header=None, names=columns)
    rul_df = pd.read_csv(rul_path, sep=r'\s+', header=None, names=['RUL'])
    
    # Calculate RUL for train_df (each engine runs to failure)
    max_cycles = train_df.groupby('machine_id')['cycle'].max().reset_index()
    max_cycles.rename(columns={'cycle': 'max_cycle'}, inplace=True)
    train_df = train_df.merge(max_cycles, on='machine_id', how='left')
    train_df['RUL'] = train_df['max_cycle'] - train_df['cycle']
    train_df.drop('max_cycle', axis=1, inplace=True)
    
    # Calculate RUL for test_df (trajectories stop prior to failure; true final RUL provided in RUL file)
    max_cycles_test = test_df.groupby('machine_id')['cycle'].max().reset_index()
    max_cycles_test.rename(columns={'cycle': 'max_cycle'}, inplace=True)
    rul_df['machine_id'] = rul_df.index + 1
    max_cycles_test = max_cycles_test.merge(rul_df, on='machine_id', how='left')
    max_cycles_test['true_max_cycle'] = max_cycles_test['max_cycle'] + max_cycles_test['RUL']
    
    test_df = test_df.merge(max_cycles_test[['machine_id', 'true_max_cycle']], on='machine_id', how='left')
    test_df['RUL'] = test_df['true_max_cycle'] - test_df['cycle']
    test_df.drop('true_max_cycle', axis=1, inplace=True)
    
    return train_df, test_df

def characterize_dataset(df_train, df_test, fd_name):
    """
    Computes statistical and structural metadata for dataset characterization.
    """
    train_engines = df_train['machine_id'].nunique()
    test_engines = df_test['machine_id'].nunique()
    
    train_seq_lens = df_train.groupby('machine_id')['cycle'].max()
    test_seq_lens = df_test.groupby('machine_id')['cycle'].max()
    
    # Distinct operating settings
    settings_combos = df_train[['setting_1', 'setting_2', 'setting_3']].round(2).drop_duplicates().shape[0]
    
    # Target distribution
    train_pos_ratio = (df_train['RUL'] <= 30).mean()
    test_pos_ratio = (df_test['RUL'] <= 30).mean()
    
    # Constant sensors (zero variance)
    sensor_cols = [c for c in df_train.columns if c.startswith('sensor_')]
    constant_sensors = [c for c in sensor_cols if df_train[c].std() < 1e-6]
    
    return {
        "dataset": fd_name,
        "train_engines": int(train_engines),
        "test_engines": int(test_engines),
        "train_cycles_total": int(len(df_train)),
        "test_cycles_total": int(len(df_test)),
        "train_seq_len_min": int(train_seq_lens.min()),
        "train_seq_len_max": int(train_seq_lens.max()),
        "train_seq_len_mean": float(train_seq_lens.mean()),
        "operating_regimes": int(settings_combos),
        "train_target_positive_rate": float(train_pos_ratio),
        "test_target_positive_rate": float(test_pos_ratio),
        "constant_sensors": constant_sensors,
        "active_sensors": [c for c in sensor_cols if c not in constant_sensors]
    }

def build_advanced_features(df, rolling_window=5, fd_name="FD001"):
    """
    Applies AeroDrift temporal rolling volatility, EWMA lag tracking,
    and contextual initial-state normalization without future temporal leakage.
    """
    df = df.copy()
    df.sort_values(by=['machine_id', 'cycle'], inplace=True)
    
    sensor_cols = [col for col in df.columns if col.startswith('sensor_')]
    df['label_fail_in_30'] = (df['RUL'] <= 30).astype(int)
    
    grouped = df.groupby('machine_id')
    
    # 1. Temporal Volatility (Rolling Std Devs)
    rolling_std = grouped[sensor_cols].rolling(window=rolling_window, min_periods=1).std()
    rolling_std.reset_index(level=0, drop=True, inplace=True)
    rolling_std.index = df.index
    rolling_std.columns = [f"{c}_rolling_std_{rolling_window}" for c in sensor_cols]
    rolling_std = rolling_std.fillna(0)
    
    # 2. Lag Indicators (EWMA)
    def calc_ewma(group):
        return group.ewm(span=rolling_window, min_periods=1).mean()
    
    ewma = grouped[sensor_cols].apply(calc_ewma)
    ewma.reset_index(level=0, drop=True, inplace=True)
    ewma.index = df.index
    ewma.columns = [f"{c}_ewma_{rolling_window}" for c in sensor_cols]
    
    # 3. Initial Baseline Normalization
    initial_values = grouped[sensor_cols].transform('first')
    normalized_sensors = df[sensor_cols] / (initial_values + 1e-9)
    normalized_sensors.columns = [f"{c}_norm_initial" for c in sensor_cols]
    
    # Combine all feature sets
    result = pd.concat([df, rolling_std, ewma, normalized_sensors], axis=1)
    
    return result

def get_common_feature_matrix(df_train, df_test):
    """
    Aligns feature columns between train and test and removes globally zero-variance columns.
    """
    feature_cols = [
        c for c in df_train.columns 
        if c not in ['machine_id', 'cycle', 'RUL', 'label_fail_in_30']
    ]
    
    # Remove features that have zero variance in train
    valid_cols = [c for c in feature_cols if df_train[c].std() > 1e-6]
    
    X_train = df_train[valid_cols].copy()
    y_train = df_train['label_fail_in_30'].copy()
    
    # Ensure test has identical columns
    X_test = df_test[valid_cols].copy()
    y_test = df_test['label_fail_in_30'].copy()
    
    return X_train, y_train, X_test, y_test, valid_cols

def evaluate_predictions(y_true, probs, threshold=0.5):
    preds = (probs >= threshold).astype(int)
    
    f1 = float(f1_score(y_true, preds, zero_division=0))
    precision = float(precision_score(y_true, preds, zero_division=0))
    recall = float(recall_score(y_true, preds, zero_division=0))
    
    try:
        roc_auc = float(roc_auc_score(y_true, probs))
    except:
        roc_auc = 0.0
        
    try:
        pr_auc = float(average_precision_score(y_true, probs))
    except:
        pr_auc = 0.0
        
    brier = float(brier_score_loss(y_true, probs))
    
    cm = confusion_matrix(y_true, preds, labels=[0, 1])
    tn, fp, fn, tp = cm.ravel()
    fpr = float(fp / (fp + tn)) if (fp + tn) > 0 else 0.0
    
    return {
        "f1": f1,
        "precision": precision,
        "recall": recall,
        "roc_auc": roc_auc,
        "pr_auc": pr_auc,
        "brier": brier,
        "fpr": fpr,
        "tp": int(tp),
        "fp": int(fp),
        "tn": int(tn),
        "fn": int(fn)
    }

def run_all_experiments():
    datasets = ["FD001", "FD002", "FD003", "FD004"]
    raw_data = {}
    feats_data = {}
    characterizations = []
    
    print("="*60)
    print("STEP 1: DATASET INGESTION & CHARACTERIZATION")
    print("="*60)
    for ds in datasets:
        train_df, test_df = load_dataset(ds)
        raw_data[ds] = (train_df, test_df)
        char = characterize_dataset(train_df, test_df, ds)
        characterizations.append(char)
        print(f"[{ds}] Train: {char['train_engines']} engines ({char['train_cycles_total']} cycles) | "
              f"Test: {char['test_engines']} engines ({char['test_cycles_total']} cycles) | "
              f"Regimes: {char['operating_regimes']} | "
              f"Active Sensors: {len(char['active_sensors'])}/21")
        
        train_f = build_advanced_features(train_df, fd_name=ds)
        test_f = build_advanced_features(test_df, fd_name=ds)
        feats_data[ds] = (train_f, test_f)

    # -------------------------------------------------------------
    # EXPERIMENT A: INDIVIDUAL DATASET EVALUATION
    # -------------------------------------------------------------
    print("\n" + "="*60)
    print("EXPERIMENT A: INDIVIDUAL DATASET EVALUATION (IN-DOMAIN)")
    print("="*60)
    exp_a_results = {}
    trained_models = {}
    feature_sets = {}
    
    for ds in datasets:
        train_f, test_f = feats_data[ds]
        X_train, y_train, X_test, y_test, valid_cols = get_common_feature_matrix(train_f, test_f)
        feature_sets[ds] = valid_cols
        
        # 1. Logistic Regression Baseline
        lr = LogisticRegression(max_iter=500, random_state=42)
        try:
            lr.fit(X_train, y_train)
            lr_probs = lr.predict_proba(X_test)[:, 1]
            lr_metrics = evaluate_predictions(y_test, lr_probs)
        except Exception as e:
            lr_metrics = {"error": str(e)}
            
        # 2. XGBoost Production Model
        xgb_clf = xgb.XGBClassifier(
            n_estimators=100,
            max_depth=4,
            learning_rate=0.1,
            subsample=0.8,
            colsample_bytree=0.8,
            eval_metric='logloss',
            random_state=42
        )
        xgb_clf.fit(X_train, y_train)
        xgb_probs = xgb_clf.predict_proba(X_test)[:, 1]
        xgb_metrics = evaluate_predictions(y_test, xgb_probs)
        
        trained_models[ds] = xgb_clf
        
        exp_a_results[ds] = {
            "logistic_regression": lr_metrics,
            "xgboost": xgb_metrics
        }
        
        print(f"\n--- {ds} Evaluation ---")
        print(f"  Logistic Regression: F1={lr_metrics.get('f1', 0):.4f} | Prec={lr_metrics.get('precision', 0):.4f} | Rec={lr_metrics.get('recall', 0):.4f} | ROC-AUC={lr_metrics.get('roc_auc', 0):.4f} | Brier={lr_metrics.get('brier', 0):.4f}")
        print(f"  XGBoost (AeroDrift): F1={xgb_metrics['f1']:.4f} | Prec={xgb_metrics['precision']:.4f} | Rec={xgb_metrics['recall']:.4f} | ROC-AUC={xgb_metrics['roc_auc']:.4f} | Brier={xgb_metrics['brier']:.4f} | FPR={xgb_metrics['fpr']:.4f}")

    # -------------------------------------------------------------
    # EXPERIMENT B: CROSS-DATASET GENERALIZATION
    # -------------------------------------------------------------
    print("\n" + "="*60)
    print("EXPERIMENT B: CROSS-DATASET GENERALIZATION MATRIX")
    print("="*60)
    exp_b_results = {}
    
    for train_ds in datasets:
        exp_b_results[train_ds] = {}
        model = trained_models[train_ds]
        train_cols = feature_sets[train_ds]
        
        for test_ds in datasets:
            test_f = feats_data[test_ds][1]
            
            # Align test features to model's training columns (fill missing with 0)
            X_test_aligned = pd.DataFrame(index=test_f.index)
            for c in train_cols:
                if c in test_f.columns:
                    X_test_aligned[c] = test_f[c]
                else:
                    X_test_aligned[c] = 0.0
            
            y_test = test_f['label_fail_in_30']
            probs = model.predict_proba(X_test_aligned)[:, 1]
            metrics = evaluate_predictions(y_test, probs)
            exp_b_results[train_ds][test_ds] = metrics
            
            print(f"  Train: {train_ds} -> Test: {test_ds:6s} | F1: {metrics['f1']:.4f} | ROC-AUC: {metrics['roc_auc']:.4f} | Brier: {metrics['brier']:.4f} | Recall: {metrics['recall']:.4f} | Prec: {metrics['precision']:.4f}")

    # -------------------------------------------------------------
    # EXPERIMENT C: OPERATING-CONDITION ROBUSTNESS (FD002 / FD004)
    # -------------------------------------------------------------
    print("\n" + "="*60)
    print("EXPERIMENT C: OPERATING-CONDITION ROBUSTNESS (FD002 & FD004)")
    print("="*60)
    exp_c_results = {}
    
    for ds in ["FD002", "FD004"]:
        test_raw = raw_data[ds][1]
        test_f = feats_data[ds][1]
        model = trained_models[ds]
        cols = feature_sets[ds]
        
        # Cluster operating settings into 6 regimes using KMeans
        kmeans = KMeans(n_clusters=6, random_state=42)
        regimes = kmeans.fit_predict(test_raw[['setting_1', 'setting_2', 'setting_3']])
        
        probs = model.predict_proba(test_f[cols])[:, 1]
        y_test = test_f['label_fail_in_30'].values
        
        regime_metrics = {}
        print(f"\n--- {ds} Performance per Operating Regime ---")
        for r in range(6):
            mask = (regimes == r)
            if np.sum(mask) > 0 and np.sum(y_test[mask]) > 0:
                m = evaluate_predictions(y_test[mask], probs[mask])
                regime_metrics[f"regime_{r}"] = {
                    "count": int(np.sum(mask)),
                    "pos_count": int(np.sum(y_test[mask])),
                    "f1": m['f1'],
                    "recall": m['recall'],
                    "precision": m['precision'],
                    "brier": m['brier']
                }
                print(f"  Regime {r} (N={np.sum(mask):5d}, Pos={np.sum(y_test[mask]):3d}): F1={m['f1']:.4f} | Recall={m['recall']:.4f} | Prec={m['precision']:.4f} | Brier={m['brier']:.4f}")
            else:
                regime_metrics[f"regime_{r}"] = {"count": int(np.sum(mask)), "pos_count": int(np.sum(y_test[mask])), "status": "insufficient_positives"}
                print(f"  Regime {r} (N={np.sum(mask):5d}): Insufficient positives for evaluation")
                
        exp_c_results[ds] = regime_metrics

    # -------------------------------------------------------------
    # EXPERIMENT D: SENSOR ABLATION & ROBUSTNESS (FD001)
    # -------------------------------------------------------------
    print("\n" + "="*60)
    print("EXPERIMENT D: SENSOR ROBUSTNESS & ABLATION EXPERIMENTS")
    print("="*60)
    exp_d_results = {}
    
    for ds in ["FD001", "FD003"]:
        train_f, test_f = feats_data[ds]
        X_train, y_train, X_test, y_test, valid_cols = get_common_feature_matrix(train_f, test_f)
        
        # Baseline
        base_model = trained_models[ds]
        base_probs = base_model.predict_proba(X_test)[:, 1]
        base_metrics = evaluate_predictions(y_test, base_probs)
        
        # Tree explainer to find top sensors
        explainer = shap.TreeExplainer(base_model)
        sample = X_test.sample(min(200, len(X_test)), random_state=42)
        shap_vals = explainer.shap_values(sample)
        mean_shap = np.abs(shap_vals).mean(axis=0)
        
        top_feature_idx = np.argsort(mean_shap)[::-1]
        top_features = [valid_cols[i] for i in top_feature_idx]
        
        top_1_feat = top_features[0]
        top_3_feats = top_features[:3]
        
        # 1. Ablation: Remove Top 1 Feature
        cols_no_top1 = [c for c in valid_cols if c != top_1_feat]
        m_no_top1 = xgb.XGBClassifier(n_estimators=100, max_depth=4, learning_rate=0.1, random_state=42, eval_metric='logloss')
        m_no_top1.fit(X_train[cols_no_top1], y_train)
        probs_no_top1 = m_no_top1.predict_proba(X_test[cols_no_top1])[:, 1]
        metrics_no_top1 = evaluate_predictions(y_test, probs_no_top1)
        
        # 2. Ablation: Remove Top 3 Features
        cols_no_top3 = [c for c in valid_cols if c not in top_3_feats]
        m_no_top3 = xgb.XGBClassifier(n_estimators=100, max_depth=4, learning_rate=0.1, random_state=42, eval_metric='logloss')
        m_no_top3.fit(X_train[cols_no_top3], y_train)
        probs_no_top3 = m_no_top3.predict_proba(X_test[cols_no_top3])[:, 1]
        metrics_no_top3 = evaluate_predictions(y_test, probs_no_top3)
        
        # 3. Missing Sensor Scenario at Inference Time (Simulated Broken Sensor = 0)
        X_test_broken = X_test.copy()
        X_test_broken[top_1_feat] = 0.0
        probs_broken = base_model.predict_proba(X_test_broken)[:, 1]
        metrics_broken = evaluate_predictions(y_test, probs_broken)
        
        exp_d_results[ds] = {
            "baseline": base_metrics,
            "top_1_feature_removed": top_1_feat,
            "no_top_1_metrics": metrics_no_top1,
            "top_3_features_removed": top_3_feats,
            "no_top_3_metrics": metrics_no_top3,
            "missing_sensor_inference_metrics": metrics_broken
        }
        
        print(f"\n--- {ds} Sensor Ablation Results ---")
        print(f"  Baseline:               F1={base_metrics['f1']:.4f} | Prec={base_metrics['precision']:.4f} | Recall={base_metrics['recall']:.4f}")
        print(f"  Drop Top 1 ({top_1_feat[:20]}): F1={metrics_no_top1['f1']:.4f} | Prec={metrics_no_top1['precision']:.4f} | Recall={metrics_no_top1['recall']:.4f}")
        print(f"  Drop Top 3:             F1={metrics_no_top3['f1']:.4f} | Prec={metrics_no_top3['precision']:.4f} | Recall={metrics_no_top3['recall']:.4f}")
        print(f"  Simulated Sensor Zero:  F1={metrics_broken['f1']:.4f} | Prec={metrics_broken['precision']:.4f} | Recall={metrics_broken['recall']:.4f}")

    # -------------------------------------------------------------
    # EXPERIMENT E: MEASUREMENT NOISE ROBUSTNESS
    # -------------------------------------------------------------
    print("\n" + "="*60)
    print("EXPERIMENT E: TELEMETRY NOISE ROBUSTNESS (FD001 & FD002)")
    print("="*60)
    exp_e_results = {}
    noise_levels = [0.02, 0.05, 0.10, 0.20] # 2%, 5%, 10%, 20% additive Gaussian noise relative to feature std
    
    for ds in ["FD001", "FD002"]:
        exp_e_results[ds] = {}
        train_f, test_f = feats_data[ds]
        X_train, y_train, X_test, y_test, valid_cols = get_common_feature_matrix(train_f, test_f)
        model = trained_models[ds]
        
        stds = X_test.std()
        print(f"\n--- {ds} Noise Injection Stress Test ---")
        
        for nl in noise_levels:
            np.random.seed(42)
            noise = np.random.normal(0, nl, size=X_test.shape) * stds.values
            X_noisy = X_test + noise
            
            probs_noisy = model.predict_proba(X_noisy)[:, 1]
            metrics_noisy = evaluate_predictions(y_test, probs_noisy)
            exp_e_results[ds][f"noise_{int(nl*100)}pct"] = metrics_noisy
            
            print(f"  Noise Level {int(nl*100):2d}%: F1={metrics_noisy['f1']:.4f} | Prec={metrics_noisy['precision']:.4f} | Recall={metrics_noisy['recall']:.4f} | Brier={metrics_noisy['brier']:.4f}")

    # -------------------------------------------------------------
    # EXPERIMENT F: TEMPORAL LIFECYCLE ROBUSTNESS
    # -------------------------------------------------------------
    print("\n" + "="*60)
    print("EXPERIMENT F: TEMPORAL LIFECYCLE ROBUSTNESS (EARLY vs MID vs LATE)")
    print("="*60)
    exp_f_results = {}
    
    for ds in datasets:
        train_f, test_f = feats_data[ds]
        X_train, y_train, X_test, y_test, valid_cols = get_common_feature_matrix(train_f, test_f)
        model = trained_models[ds]
        
        probs = model.predict_proba(X_test)[:, 1]
        ruls = test_f['RUL'].values
        
        # Lifecycle stages
        early_mask = (ruls > 100)
        mid_mask = (ruls > 30) & (ruls <= 100)
        late_mask = (ruls <= 30)
        
        # In early and mid life, true label is 0 (healthy). We measure False Positive Rate / Mean Failure Probability
        early_mean_prob = float(np.mean(probs[early_mask])) if np.sum(early_mask) > 0 else 0.0
        early_false_alarms = int(np.sum(probs[early_mask] >= 0.5))
        
        mid_mean_prob = float(np.mean(probs[mid_mask])) if np.sum(mid_mask) > 0 else 0.0
        mid_false_alarms = int(np.sum(probs[mid_mask] >= 0.5))
        
        late_mean_prob = float(np.mean(probs[late_mask])) if np.sum(late_mask) > 0 else 0.0
        late_detections = int(np.sum(probs[late_mask] >= 0.5))
        late_total = int(np.sum(late_mask))
        late_recall = float(late_detections / late_total) if late_total > 0 else 0.0
        
        exp_f_results[ds] = {
            "early_life_N": int(np.sum(early_mask)),
            "early_life_mean_prob": early_mean_prob,
            "early_life_false_alarms": early_false_alarms,
            "mid_life_N": int(np.sum(mid_mask)),
            "mid_life_mean_prob": mid_mean_prob,
            "mid_life_false_alarms": mid_false_alarms,
            "late_life_N": late_total,
            "late_life_mean_prob": late_mean_prob,
            "late_life_detections": late_detections,
            "late_life_recall": late_recall
        }
        
        print(f"\n--- {ds} Lifecycle Stage Progression ---")
        print(f"  Early Life (RUL > 100, N={np.sum(early_mask):5d}): Mean P(Fail) = {early_mean_prob*100:5.2f}% | False Alarms = {early_false_alarms}")
        print(f"  Mid Life   (30-100,    N={np.sum(mid_mask):5d}): Mean P(Fail) = {mid_mean_prob*100:5.2f}% | False Alarms = {mid_false_alarms}")
        print(f"  Late Life  (RUL <= 30, N={late_total:5d}): Mean P(Fail) = {late_mean_prob*100:5.2f}% | True Detections = {late_detections}/{late_total} ({late_recall*100:.1f}%)")

    # -------------------------------------------------------------
    # SHAP FEATURE IMPORTANCE ACROSS DATASETS
    # -------------------------------------------------------------
    print("\n" + "="*60)
    print("SHAP ANALYSIS ACROSS FD001, FD002, FD003, FD004")
    print("="*60)
    shap_rankings = {}
    
    for ds in datasets:
        train_f, test_f = feats_data[ds]
        X_train, y_train, X_test, y_test, valid_cols = get_common_feature_matrix(train_f, test_f)
        model = trained_models[ds]
        
        explainer = shap.TreeExplainer(model)
        sample = X_test.sample(min(150, len(X_test)), random_state=42)
        shap_vals = explainer.shap_values(sample)
        mean_shap = np.abs(shap_vals).mean(axis=0)
        
        top_idx = np.argsort(mean_shap)[::-1][:5]
        top_list = [{"feature": valid_cols[i], "mean_abs_shap": float(mean_shap[i])} for i in top_idx]
        shap_rankings[ds] = top_list
        
        print(f"\n--- {ds} Top 5 SHAP Features ---")
        for item in top_list:
            print(f"  {item['feature']:30s}: {item['mean_abs_shap']:.4f}")

    # -------------------------------------------------------------
    # SAVE ALL RESULTS TO JSON
    # -------------------------------------------------------------
    all_results = {
        "characterizations": characterizations,
        "experiment_a_individual": exp_a_results,
        "experiment_b_cross_dataset": exp_b_results,
        "experiment_c_operating_conditions": exp_c_results,
        "experiment_d_sensor_ablation": exp_d_results,
        "experiment_e_noise_robustness": exp_e_results,
        "experiment_f_temporal_lifecycle": exp_f_results,
        "shap_rankings": shap_rankings
    }
    
    with open("advanced_experiment_results.json", "w") as f:
        json.dump(all_results, f, indent=2)
        
    print("\nAll advanced experiments completed successfully! Results written to advanced_experiment_results.json")

if __name__ == "__main__":
    run_all_experiments()
