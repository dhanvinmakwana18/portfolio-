import pandas as pd
import numpy as np

def build_features(df, rolling_window=5):
    """
    Feature Engineering: Temporal volatility (rolling std devs), Lag indicators (EWMA), 
    and contextually normalized sensors.
    """
    df = df.copy()
    df.sort_values(by=['machine_id', 'cycle'], inplace=True)
    
    sensor_cols = [col for col in df.columns if col.startswith('sensor_')]
    
    # Target formulation: Binary Classification ("Will this machine fail within the next N cycles?")
    # Let N = 30
    if 'RUL' in df.columns:
        df['label_fail_in_30'] = (df['RUL'] <= 30).astype(int)
    
    grouped = df.groupby('machine_id')
    
    # Temporal Volatility (Rolling Std Devs)
    # Using groupby.rolling.std().reset_index(level=0, drop=True) might complain in newer pandas.
    # Safe way:
    rolling_std = grouped[sensor_cols].rolling(window=rolling_window, min_periods=1).std()
    rolling_std.reset_index(level=0, drop=True, inplace=True)
    # handle case where index might not align directly if not careful, but sort_values ensures it
    rolling_std.index = df.index
    rolling_std.columns = [f"{c}_rolling_std_{rolling_window}" for c in sensor_cols]
    # fillna with 0 for the first element
    rolling_std = rolling_std.fillna(0)
    
    # Lag indicators (EWMA)
    def calculate_ewma(group):
        return group.ewm(span=rolling_window, min_periods=1).mean()
    
    ewma = grouped[sensor_cols].apply(calculate_ewma)
    ewma.reset_index(level=0, drop=True, inplace=True)
    ewma.index = df.index
    ewma.columns = [f"{c}_ewma_{rolling_window}" for c in sensor_cols]
    
    # Contextual normalization: Sensor value relative to operating condition (initial state)
    initial_values = grouped[sensor_cols].transform('first')
    normalized_sensors = df[sensor_cols] / initial_values
    normalized_sensors.columns = [f"{c}_norm_initial" for c in sensor_cols]
    
    # Combine features
    result = pd.concat([df, rolling_std, ewma, normalized_sensors], axis=1)
    
    return result
