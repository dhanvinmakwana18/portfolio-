import pandas as pd
import numpy as np
import os

def generate_synthetic_turbofan_data(num_machines=100, min_cycles=100, max_cycles=350, random_seed=42, start_id=1):
    np.random.seed(random_seed)
    
    data = []
    
    for machine_id in range(start_id, start_id + num_machines):
        num_cycles = np.random.randint(min_cycles, max_cycles)
        
        # Base sensor values that degrade over time
        # Degradation starts slowly and accelerates near the end of life
        time_fraction = np.arange(1, num_cycles + 1) / num_cycles
        
        # Operational settings
        setting_1 = np.random.normal(0, 0.5, num_cycles)
        setting_2 = np.random.normal(0, 0.2, num_cycles)
        
        # Sensors with varying degradation patterns
        sensor_1 = 100 + 10 * time_fraction**2 + np.random.normal(0, 1, num_cycles) # Quadratic increase
        sensor_2 = 200 - 20 * time_fraction**3 + np.random.normal(0, 2, num_cycles) # Cubic decrease
        sensor_3 = 50 + np.random.normal(0, 5, num_cycles) # Noisy, stable
        sensor_4 = 150 + 5 * time_fraction + np.random.normal(0, 1.5, num_cycles) # Linear increase
        sensor_5 = 300 - 15 * np.exp(time_fraction - 1) + np.random.normal(0, 2, num_cycles) # Exponential decrease near failure
        
        # Combine into dataframe
        machine_df = pd.DataFrame({
            'machine_id': machine_id,
            'cycle': np.arange(1, num_cycles + 1),
            'setting_1': setting_1,
            'setting_2': setting_2,
            'sensor_1': sensor_1,
            'sensor_2': sensor_2,
            'sensor_3': sensor_3,
            'sensor_4': sensor_4,
            'sensor_5': sensor_5,
            'RUL': num_cycles - np.arange(1, num_cycles + 1)
        })
        
        data.append(machine_df)
        
    final_df = pd.concat(data, ignore_index=True)
    return final_df

if __name__ == "__main__":
    os.makedirs(os.path.dirname(os.path.abspath(__file__)), exist_ok=True)
    
    print("Generating train data...")
    train_df = generate_synthetic_turbofan_data(num_machines=80, random_seed=42, start_id=1)
    train_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "train_data.csv")
    train_df.to_csv(train_path, index=False)
    
    print("Generating test data...")
    test_df = generate_synthetic_turbofan_data(num_machines=20, random_seed=999, start_id=81)
    test_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "test_data.csv")
    test_df.to_csv(test_path, index=False)
    
    print(f"Data generation complete. Saved to {train_path} and {test_path}")
