from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import sqlite3
import json

app = FastAPI()

# Define data model
class Data(BaseModel):
    revenue: int
    activeUsers: int
    conversionRate: float
    systemUptime: float
    chartLabels: list
    chartData: list
    tableData: list

# Connect to database
conn = sqlite3.connect('data.db')
Cursor = conn.cursor()

# Create table if not exists
Cursor.execute('''
    CREATE TABLE IF NOT EXISTS data (
        id INTEGER PRIMARY KEY,
        revenue INTEGER,
        activeUsers INTEGER,
        conversionRate REAL,
        systemUptime REAL,
        chartLabels TEXT,
        chartData TEXT,
        tableData TEXT
    )
''')

# Insert data into table
def insert_data(data: Data):
    Cursor.execute('INSERT INTO data (revenue, activeUsers, conversionRate, systemUptime, chartLabels, chartData, tableData) VALUES (?, ?, ?, ?, ?, ?, ?)',
                   (data.revenue, data.activeUsers, data.conversionRate, data.systemUptime, json.dumps(data.chartLabels), json.dumps(data.chartData), json.dumps(data.tableData)))
    conn.commit()

# Get data from table
def get_data(filter: str = None):
    if filter:
        Cursor.execute('SELECT * FROM data WHERE id = ?', (filter,))
    else:
        Cursor.execute('SELECT * FROM data')
    data = Cursor.fetchone()
    if data:
        return Data(
            revenue=data[1],
            activeUsers=data[2],
            conversionRate=data[3],
            systemUptime=data[4],
            chartLabels=json.loads(data[5]),
            chartData=json.loads(data[6]),
            tableData=json.loads(data[7])
        )
    return None

# API endpoint to get data
@app.get('/api/data', response_model=Data)
async def get_data_api(filter: str = None):
    data = get_data(filter)
    if data:
        return data
    return JSONResponse(content={'error': 'Data not found'}, status_code=404)

# Run app
if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000)