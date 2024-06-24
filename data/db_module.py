import pyodbc 
import data.main as main

try:
    server = 'DESKTOP-HV9AC1E'
    database = 'WeatherSimualtion'
    username = 'sa'
    password = '123'
    connection= pyodbc.connect('DRIVER={SQL SERVER};'+ 'Server={DESKTOP-HV9AC1E};'+'Database={WeatherSimulation};'+ 'Trusted_Connection=True')
    print("connected succesfully")
except pyodbc.Error as ex:
    print("Connection Failed")

    


