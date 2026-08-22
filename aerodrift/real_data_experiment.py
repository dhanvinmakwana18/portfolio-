import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import f1_score, precision_score, recall_score, roc_auc_score, brier_score_loss, confusion_matrix
import shap
import mlflow
import os

def load_cmapss_data(train_path, test_path, rul_path):
    columns = ['machine_id', 'cycle', 'setting_1', 'setting_2', 'setting_3'] + [f'sensor_{i}' for i in range(1, 22)]
    
    train_df = pd.read_csv(train_path, sep=r'\s+', header=None, names=columns)
    test_df = pd.read_csv(test_path, sep=r'\s+', header=None, names=columns)
    rul_df = pd.read_csv(rul_path, sep=r'\s+', header=None, names=['RUL'])
    
    # Calculate RUL for train_df
    max_cycles = train_df.groupby('machine_id')['cycle'].max().reset_index()
    max_cycles.rename(columns={'cycle': 'max_cycle'}, inplace=True)
    train_df = train_df.merge(max_cycles, on='machine_id', how='left')
    train_df['RUL'] = train_df['max_cycle'] - train_df['cycle']
    train_df.drop('max_cycle', axis=1, inplace=True)
    
    # Calculate RUL for test_df
    # In test set, the RUL file contains the RUL at the END of the test trajectory for each machine.
    max_cycles_test = test_df.groupby('machine_id')['cycle'].max().reset_index()
    max_cycles_test.rename(columns={'cycle': 'max_cycle'}, inplace=True)
    rul_df['machine_id'] = rul_df.index + 1
    max_cycles_test = max_cycles_test.merge(rul_df, on='machine_id', how='left')
    max_cycles_test['true_max_cycle'] = max_cycles_test['max_cycle'] + max_cycles_test['RUL']
    
    test_df = test_df.merge(max_cycles_test[['machine_id', 'true_max_cycle']], on='machine_id', how='left')
    test_df['RUL'] = test_df['true_max_cycle'] - test_df['cycle']
    test_df.drop('true_max_cycle', axis=1, inplace=True)
    
    return train_df, test_df

def build_features(df, rolling_window=5):
    df = df.copy()
    df.sort_values(by=['machine_id', 'cycle'], inplace=True)
    
    sensor_cols = [col for col in df.columns if col.startswith('sensor_')]
    df['label_fail_in_30'] = (df['RUL'] <= 30).astype(int)
    
    grouped = df.groupby('machine_id')
    
    rolling_std = grouped[sensor_cols].rolling(window=rolling_window, min_periods=1).std()
    rolling_std.reset_index(level=0, drop=True, inplace=True)
    rolling_std.index = df.index
    rolling_std.columns = [f"{c}_rolling_std_{rolling_window}" for c in sensor_cols]
    rolling_std = rolling_std.fillna(0)
    
    def calculate_ewma(group):
        return group.ewm(span=rolling_window, min_periods=1).mean()
    
    ewma = grouped[sensor_cols].apply(calculate_ewma)
    ewma.reset_index(level=0, drop=True, inplace=True)
    ewma.index = df.index
    ewma.columns = [f"{c}_ewma_{rolling_window}" for c in sensor_cols]
    
    initial_values = grouped[sensor_cols].transform('first')
    
    # Avoid division by zero by adding a small epsilon
    normalized_sensors = df[sensor_cols] / (initial_values + 1e-9)
    normalized_sensors.columns = [f"{c}_norm_initial" for c in sensor_cols]
    
    result = pd.concat([df, rolling_std, ewma, normalized_sensors], axis=1)
    
    # Drop columns that are completely constant (like sensor_1, sensor_10, etc in FD001)
    # This reduces noise.
    feature_cols = [c for c in result.columns if c not in ['machine_id', 'cycle', 'RUL', 'label_fail_in_30']]
    for c in feature_cols:
        if result[c].nunique() <= 1:
            result.drop(c, axis=1, inplace=True)
            
    return result

def evaluate_model(name, model, X_test, y_test):
    preds = model.predict(X_test)
    probs = model.predict_proba(X_test)[:, 1]
    
    print(f"\n--- {name} Evaluation ---")
    print(f"F1 Score:  {f1_score(y_test, preds):.4f}")
    print(f"Precision: {precision_score(y_test, preds):.4f}")
    print(f"Recall:    {recall_score(y_test, preds):.4f}")
    print(f"ROC-AUC:   {roc_auc_score(y_test, probs):.4f}")
    print(f"Brier:     {brier_score_loss(y_test, probs):.4f}")
    
    cm = confusion_matrix(y_test, preds)
    tn, fp, fn, tp = cm.ravel()
    fpr = fp / (fp + tn)
    print(f"FPR:       {fpr:.4f}")

def run_experiment():
    print("Loading CMAPSS Data...")
    train_raw, test_raw = load_cmapss_data('train_FD001.txt', 'test_FD001.txt', 'RUL_FD001.txt')
    
    print("Building Features...")
    train_df = build_features(train_raw)
    test_df = build_features(test_raw)
    
    feature_cols = [c for c in train_df.columns if c not in ['machine_id', 'cycle', 'RUL', 'label_fail_in_30']]
    
    X_train = train_df[feature_cols]
    y_train = train_df['label_fail_in_30']
    
    X_test = test_df[feature_cols]
    y_test = test_df['label_fail_in_30']
    
    print(f"Train shape: {X_train.shape}, Test shape: {X_test.shape}")
    
    print("\nTraining Logistic Regression Baseline...")
    lr = LogisticRegression(max_iter=1000)
    lr.fit(X_train, y_train)
    evaluate_model("Logistic Regression", lr, X_test, y_test)
    
    print("\nTraining XGBoost (AeroDrift Config)...")
    xgb_model = xgb.XGBClassifier(
        n_estimators=100, 
        max_depth=4, 
        learning_rate=0.1, 
        eval_metric='logloss',
        random_state=42
    )
    xgb_model.fit(X_train, y_train)
    evaluate_model("XGBoost", xgb_model, X_test, y_test)
    
    print("\nRunning SHAP Analysis...")
    explainer = shap.TreeExplainer(xgb_model)
    # Just take a sample to speed up
    sample = X_test.sample(100, random_state=42)
    shap_values = explainer.shap_values(sample)
    
    mean_abs_shap = np.abs(shap_values).mean(axis=0)
    top_features_idx = np.argsort(mean_abs_shap)[::-1][:5]
    print("Top 5 SHAP Features:")
    for idx in top_features_idx:
        print(f"  {feature_cols[idx]}: {mean_abs_shap[idx]:.4f}")

    print("\nReal Data Validation Complete.")

if __name__ == '__main__':
    run_experiment()
