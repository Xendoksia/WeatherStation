import pyodbc
import random
import pandas as pd
import numpy as np  # Import NumPy for mathematical operations
from datetime import datetime, timedelta

# Establishing connection to the SQL server
try:
    server = 'DESKTOP-HV9AC1E'
    database = 'WeatherSimulation'
    username = 'sa'
    password = '123'
    connection = pyodbc.connect('DRIVER={SQL SERVER};'
                                'Server={DESKTOP-HV9AC1E};'
                                'Database={WeatherSimulation};'
                                'Trusted_Connection=True')
    print("Connected Successfully")
except pyodbc.Error as ex:
    print("Connection Failed")

# Function to create the table if it doesn't exist
def create_table_if_not_exists():
    cursor = connection.cursor()
    cursor.execute("""
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='HourlyWeatherData' AND xtype='U')
    CREATE TABLE HourlyWeatherData (
        DateTime DATETIME,
        Temperature FLOAT,
        AppTemperature FLOAT,
        Visibility FLOAT,
        WindSpeed FLOAT,
        Humidity FLOAT,
        Pressure FLOAT
    )
    """)
    connection.commit()

# Function to clear the table before inserting new data
def clear_table():
    cursor = connection.cursor()
    cursor.execute("DELETE FROM HourlyWeatherData")
    connection.commit()

# Function to generate weather data for 24 hours based on random start date
def generate_24_hour_forecast(start_date):
    forecast_data = []
    
    # Simulate a temperature cycle over 24 hours
    base_temperature = random.uniform(10, 20)
    
    for hour in range(24):
        next_datetime = start_date + timedelta(hours=hour)
        
        # Simulate typical daily temperature variation
        temperature = base_temperature + 5 * np.sin(2 * np.pi * (hour - 6) / 24)  # Using np for sine function
        app_temperature = temperature + random.uniform(-2, 2)
        visibility = random.uniform(8, 12)
        wind_speed = random.uniform(0, 20)
        humidity = random.uniform(40, 80)
        pressure = random.uniform(1010, 1020)
        
        forecast_data.append({
            'DateTime': next_datetime,
            'Temperature': temperature,
            'AppTemperature': app_temperature,
            'Visibility': visibility,
            'WindSpeed': wind_speed,
            'Humidity': humidity,
            'Pressure': pressure
        })
    return forecast_data

# Function to save the generated weather data to the database
def save_weather_data_to_db(data):
    cursor = connection.cursor()
    for item in data:
        cursor.execute("""
        INSERT INTO HourlyWeatherData (DateTime, Temperature, AppTemperature, Visibility, WindSpeed, Humidity, Pressure)
        VALUES (?, ?, ?, ?, ?, ?, ?)""",
                       (item['DateTime'], item['Temperature'], item['AppTemperature'], item['Visibility'],
                        item['WindSpeed'], item['Humidity'], item['Pressure']))
    connection.commit()

# Generating and saving 24-hour forecast data
if __name__ == '__main__':
    create_table_if_not_exists()
    
    # Clear the table before inserting new data
    clear_table()
    
    # Load the selected day data
    file_path = 'C:\\Users\\Deniz\\Desktop\\WeatherStation\\data\\weatherHistory.csv'
    selected_data = pd.read_csv(file_path)
    selected_data['date'] = pd.to_datetime(selected_data['Formatted Date'], utc=True)
    
    # Select a random day from the data
    random_date = selected_data['date'].sample(1).values[0]  # Ensure random_date is a single datetime object
    random_date = pd.Timestamp(random_date)  # Convert numpy.datetime64 to pandas Timestamp if needed
    
    start_date = pd.to_datetime(f"{random_date.year}-{random_date.month:02d}-{random_date.day:02d} 00:00:00", utc=True)
    
    # Generate 24-hour forecast starting from 00:00 of the selected date
    forecast_data = generate_24_hour_forecast(start_date)

    # Save the generated data to the database
    save_weather_data_to_db(forecast_data)

    print("24-hour weather forecast data saved successfully.")
    connection.close()
