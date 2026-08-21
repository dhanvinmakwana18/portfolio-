import pandas as pd
import matplotlib.pyplot as plt
import os

def perform_eda():
    train_df = pd.read_csv("data/train_data.csv")
    
    print("--- Basic Info ---")
    print(train_df.info())
    
    print("\n--- Summary Statistics ---")
    print(train_df.describe())
    
    # Plot degradation of a sensor for a few machines
    plt.figure(figsize=(10, 6))
    for machine_id in train_df['machine_id'].unique()[:5]:
        machine_data = train_df[train_df['machine_id'] == machine_id]
        plt.plot(machine_data['cycle'], machine_data['sensor_1'], label=f"Machine {machine_id}")
    
    plt.title("Sensor 1 Degradation over Cycles")
    plt.xlabel("Cycle")
    plt.ylabel("Sensor 1 Value")
    plt.legend()
    
    os.makedirs("plots", exist_ok=True)
    plt.savefig("plots/sensor_1_degradation.png")
    print("\nSaved degradation plot to plots/sensor_1_degradation.png")
    
if __name__ == "__main__":
    perform_eda()
