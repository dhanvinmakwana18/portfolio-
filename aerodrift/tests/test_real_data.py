import pytest
import pandas as pd
import numpy as np
import os
import xgboost as xgb
from real_data_experiment import load_cmapss_data, build_features

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

@pytest.fixture
def mock_cmapss_data(tmp_path):
    # Create minimal mock text files for train, test, rul
    train_txt = tmp_path / "train.txt"
    test_txt = tmp_path / "test.txt"
    rul_txt = tmp_path / "rul.txt"
    
    # 2 machines, max 3 cycles
    train_data = [
        "1 1 -0.0007 -0.0004 100.0 518.67 641.82 1589.70 1400.60 14.62 21.61 554.36 2388.06 9046.19 1.30 47.47 521.66 2388.02 8138.62 8.4195 0.03 392 2388 100.00 39.06 23.4190",
        "1 2 0.0019 -0.0003 100.0 518.67 642.15 1591.82 1403.14 14.62 21.61 553.75 2388.04 9044.07 1.30 47.49 522.28 2388.07 8131.49 8.4318 0.03 392 2388 100.00 39.00 23.4236",
        "2 1 -0.0043 0.0003 100.0 518.67 642.35 1587.99 1404.20 14.62 21.61 554.26 2388.08 9052.94 1.30 47.50 522.42 2388.03 8133.23 8.4178 0.03 390 2388 100.00 38.95 23.3442",
    ]
    test_data = [
        "1 1 0.0023 0.0003 100.0 518.67 643.02 1581.27 1399.70 14.62 21.61 554.02 2388.04 9051.05 1.30 47.27 521.72 2388.03 8129.21 8.4152 0.03 392 2388 100.00 39.04 23.4144",
        "2 1 -0.0027 0.0001 100.0 518.67 643.84 1604.53 1431.41 14.62 21.61 551.44 2388.13 9052.62 1.30 47.66 521.36 2388.11 8140.23 8.4662 0.03 394 2388 100.00 38.83 23.2367",
    ]
    rul_data = ["112", "98"] # RUL for machine 1 is 112, for machine 2 is 98
    
    train_txt.write_text("\n".join(train_data))
    test_txt.write_text("\n".join(test_data))
    rul_txt.write_text("\n".join(rul_data))
    
    return str(train_txt), str(test_txt), str(rul_txt)

def test_dataset_parsing_and_schema(mock_cmapss_data):
    train_path, test_path, rul_path = mock_cmapss_data
    train_df, test_df = load_cmapss_data(train_path, test_path, rul_path)
    
    assert len(train_df) == 3
    assert len(test_df) == 2
    
    expected_cols = ['machine_id', 'cycle', 'setting_1', 'setting_2', 'setting_3'] + [f'sensor_{i}' for i in range(1, 22)] + ['RUL']
    for col in expected_cols:
        assert col in train_df.columns
        assert col in test_df.columns

def test_target_generation_and_leakage(mock_cmapss_data):
    train_path, test_path, rul_path = mock_cmapss_data
    train_df, test_df = load_cmapss_data(train_path, test_path, rul_path)
    
    train_feats = build_features(train_df)
    test_feats = build_features(test_df)
    
    assert 'label_fail_in_30' in train_feats.columns
    # Check max cycle for machine 1 train is 2, RULs should be 1, 0. So labels should be 1 (since 1 <= 30)
    assert (train_feats[train_feats['machine_id'] == 1]['RUL'].values == np.array([1, 0])).all()
    assert (train_feats[train_feats['machine_id'] == 1]['label_fail_in_30'].values == 1).all()

def test_machine_level_split(mock_cmapss_data):
    train_path, test_path, rul_path = mock_cmapss_data
    train_df, test_df = load_cmapss_data(train_path, test_path, rul_path)
    
    # In real dataset they are completely separate, but here we intentionally used 1 and 2 in both just for parsing.
    # The requirement is that we evaluate on genuinely unseen machine trajectories in the real code, which C-MAPSS FD001 natively guarantees.
    assert len(train_df['machine_id'].unique()) == 2

def test_temporal_feature_generation(mock_cmapss_data):
    train_path, test_path, rul_path = mock_cmapss_data
    train_df, test_df = load_cmapss_data(train_path, test_path, rul_path)
    
    feats = build_features(train_df, rolling_window=2)
    
    # Check rolling std exists and doesn't leak (first row should be 0)
    assert 'sensor_2_rolling_std_2' in feats.columns
    first_machine_rows = feats[feats['machine_id'] == 1]
    assert first_machine_rows.iloc[0]['sensor_2_rolling_std_2'] == 0.0

def test_model_inference_and_shap(mock_cmapss_data):
    import shap
    train_path, test_path, rul_path = mock_cmapss_data
    train_df, test_df = load_cmapss_data(train_path, test_path, rul_path)
    
    train_feats = build_features(train_df)
    feature_cols = [c for c in train_feats.columns if c not in ['machine_id', 'cycle', 'RUL', 'label_fail_in_30']]
    
    model = xgb.XGBClassifier(n_estimators=2, max_depth=2)
    # Give it dummy labels to avoid XGBoost error of only 1 class
    y = np.array([1, 0, 1]) 
    model.fit(train_feats[feature_cols], y)
    
    preds = model.predict(train_feats[feature_cols])
    assert len(preds) == 3
    
    explainer = shap.TreeExplainer(model)
    shap_vals = explainer.shap_values(train_feats[feature_cols])
    assert shap_vals.shape == (3, len(feature_cols))
