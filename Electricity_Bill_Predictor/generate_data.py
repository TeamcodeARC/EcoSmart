import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def generate_energy_data(start_date, periods=365):
    dates = pd.date_range(start=start_date, periods=periods, freq='D')
    
    # Base consumption with yearly trend
    t = np.arange(periods)
    base_electricity = 100 + 10 * np.sin(2 * np.pi * t / 365)  # Yearly cycle
    base_water = 45 + 5 * np.sin(2 * np.pi * t / 365)  # Yearly cycle
    
    # Add seasonal patterns (stronger in summer/winter)
    summer_peak = 25 * np.exp(-((t % 365 - 180)**2) / (2 * 40**2))  # Summer peak
    winter_peak = 20 * np.exp(-((t % 365 - 365)**2) / (2 * 40**2))  # Winter peak
    seasonal_electricity = summer_peak + winter_peak
    seasonal_water = 0.5 * summer_peak + 0.3 * winter_peak
    
    # Weekly patterns (higher on weekdays)
    weekly_pattern_e = np.tile([8, 15, 15, 15, 15, 10, 5], (periods//7 + 1))[:periods]
    weekly_pattern_w = np.tile([5, 8, 8, 8, 8, 6, 4], (periods//7 + 1))[:periods]
    
    # Add random events (spikes and dips)
    random_events_e = np.zeros(periods)
    random_events_w = np.zeros(periods)
    
    # Generate random spikes
    n_events = periods // 30  # One event per month on average
    spike_indices = np.random.choice(periods, n_events, replace=False)
    
    for idx in spike_indices:
        # Random spike or dip
        if np.random.random() > 0.5:
            random_events_e[idx:idx+3] = 20 * np.random.random()  # Spike
            random_events_w[idx:idx+3] = 10 * np.random.random()  # Spike
        else:
            random_events_e[idx:idx+3] = -15 * np.random.random()  # Dip
            random_events_w[idx:idx+3] = -8 * np.random.random()   # Dip
    
    # Random variations (daily noise)
    noise_electricity = np.random.normal(0, 3, periods)
    noise_water = np.random.normal(0, 2, periods)
    
    # Combine all patterns
    electricity = (base_electricity + 
                  seasonal_electricity + 
                  weekly_pattern_e + 
                  random_events_e + 
                  noise_electricity)
    
    water = (base_water + 
             seasonal_water + 
             weekly_pattern_w + 
             random_events_w + 
             noise_water)
    
    # Add long-term trend (slight increase over time)
    trend_e = 0.01 * t  # Small upward trend
    trend_w = 0.005 * t  # Smaller upward trend for water
    
    electricity += trend_e
    water += trend_w
    
    # Ensure no negative values and add random variations
    electricity = np.maximum(electricity, 0)
    water = np.maximum(water, 0)
    
    # Create DataFrame
    df = pd.DataFrame({
        'date': dates,
        'electricity_consumption': electricity.round(2),
        'water_consumption': water.round(2)
    })
    
    return df

def append_new_data(file_path='energy_data.csv', periods=365):
    try:
        # Read existing data
        existing_data = pd.read_csv(file_path)
        existing_data['date'] = pd.to_datetime(existing_data['date'])
        
        # Get the last date from existing data
        last_date = existing_data['date'].max()
        start_date = last_date + timedelta(days=1)
        
        # Generate new data
        new_data = generate_energy_data(start_date, periods)
        
        # Combine and save
        combined_data = pd.concat([existing_data, new_data], ignore_index=True)
        combined_data.to_csv(file_path, index=False)
        
        print(f"Added {periods} new records starting from {start_date.date()}")
        print(f"Total records in file: {len(combined_data)}")
        
    except FileNotFoundError:
        # If file doesn't exist, create new data
        print("No existing file found. Creating new dataset...")
        new_data = generate_energy_data(start_date='2020-01-01', periods=periods)
        new_data.to_csv(file_path, index=False)
        print(f"Generated {len(new_data)} new records")

if __name__ == "__main__":
    append_new_data(periods=365)  # Will add one year of data
