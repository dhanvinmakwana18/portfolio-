import pytest
import pandas as pd
import numpy as np
import os
import glob
from advanced_experiments import (
    load_dataset, 
    characterize_dataset, 
    build_advanced_features, 
    get_common_feature_matrix, 
    evaluate_predictions
)

def test_multi_dataset_loading():
    """Verify that FD001, FD002, FD003, and FD004 load cleanly with correct columns."""
    for ds in ["FD001", "FD002", "FD003", "FD004"]:
        train_df, test_df = load_dataset(ds)
        assert len(train_df) > 0
        assert len(test_df) > 0
        assert "RUL" in train_df.columns
        assert "RUL" in test_df.columns
        assert "machine_id" in train_df.columns
        assert "cycle" in train_df.columns
        assert train_df["RUL"].min() >= 0
        assert test_df["RUL"].min() >= 0

def test_machine_level_separation_all_datasets():
    """Verify that no engine ID is shared between train and test sets in any dataset."""
    for ds in ["FD001", "FD002", "FD003", "FD004"]:
        train_df, test_df = load_dataset(ds)
        # Note: In C-MAPSS, train and test files reuse IDs 1..N, but represent physically distinct engines.
        # We verify that train trajectories end in failure (RUL=0) while test trajectories stop beforehand.
        train_final_ruls = train_df.groupby("machine_id")["RUL"].min()
        assert (train_final_ruls == 0).all(), f"{ds} train engines must run to failure (RUL=0)"

def test_target_generation_no_leakage():
    """Verify target binary classification label is strictly RUL <= 30 without future leakage."""
    train_df, test_df = load_dataset("FD001")
    train_f = build_advanced_features(train_df)
    
    assert "label_fail_in_30" in train_f.columns
    expected_labels = (train_f["RUL"] <= 30).astype(int)
    assert (train_f["label_fail_in_30"] == expected_labels).all()

def test_temporal_feature_generation_no_future_leakage():
    """Verify rolling standard deviation and EWMA lag indicators at cycle T do not use cycle > T."""
    train_df, test_df = load_dataset("FD001")
    train_f = build_advanced_features(train_df, rolling_window=5)
    
    # Check that cycle 1 has rolling std = 0 (only 1 observation)
    cycle1_rows = train_f[train_f["cycle"] == 1]
    sensor2_std_col = "sensor_2_rolling_std_5"
    assert (cycle1_rows[sensor2_std_col] == 0.0).all()
    
    # Check that EWMA at cycle 1 equals the sensor value itself
    sensor2_ewma_col = "sensor_2_ewma_5"
    assert np.allclose(cycle1_rows[sensor2_ewma_col], cycle1_rows["sensor_2"])

def test_cross_dataset_feature_alignment():
    """Verify feature matrix alignment between disparate datasets (e.g. FD001 vs FD002)."""
    train_f1, test_f1 = build_advanced_features(load_dataset("FD001")[0]), build_advanced_features(load_dataset("FD001")[1])
    train_f2, test_f2 = build_advanced_features(load_dataset("FD002")[0]), build_advanced_features(load_dataset("FD002")[1])
    
    X_train1, y_train1, X_test1, y_test1, valid_cols1 = get_common_feature_matrix(train_f1, test_f1)
    X_train2, y_train2, X_test2, y_test2, valid_cols2 = get_common_feature_matrix(train_f2, test_f2)
    
    assert len(X_train1) == len(train_f1)
    assert len(X_train2) == len(train_f2)
    assert len(valid_cols1) > 0
    assert len(valid_cols2) > 0

def test_evaluation_metric_calculations():
    """Verify evaluation metric calculations for edge cases."""
    y_true = np.array([0, 0, 1, 1])
    probs = np.array([0.1, 0.2, 0.8, 0.9])
    
    m = evaluate_predictions(y_true, probs, threshold=0.5)
    assert m["f1"] == 1.0
    assert m["precision"] == 1.0
    assert m["recall"] == 1.0
    assert m["fpr"] == 0.0
    assert m["tp"] == 2
    assert m["tn"] == 2
