import pandas as pd
import pytest
import os

def test_data_leakage():
    """
    Test confirming zero leakage between train/test machines.
    Machine A and Machine B can never exist in both Train and Test simultaneously.
    """
    train_path = os.path.join(os.path.dirname(__file__), "..", "data", "train_data.csv")
    test_path = os.path.join(os.path.dirname(__file__), "..", "data", "test_data.csv")
    
    assert os.path.exists(train_path), f"{train_path} not found"
    assert os.path.exists(test_path), f"{test_path} not found"
    
    train_df = pd.read_csv(train_path)
    test_df = pd.read_csv(test_path)
    
    train_machines = set(train_df['machine_id'].unique())
    test_machines = set(test_df['machine_id'].unique())
    
    intersection = train_machines.intersection(test_machines)
    
    assert len(intersection) == 0, f"DATA LEAKAGE DETECTED! Machines in both train and test: {intersection}"
    
    # Check that neither dataframe is empty
    assert len(train_df) > 0, "Train dataframe is empty"
    assert len(test_df) > 0, "Test dataframe is empty"
    
    print("Leakage test passed. Zero machine overlap between train and test datasets.")
