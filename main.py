from fastapi import FastAPI
from fastapi.responses import HTMLResponse
import sqlite3

app = FastAPI()

@app.get('/'
def read_root():

    return {'Hello': 'World'}

@app.get('/metrics'
def read_metrics():

    conn = sqlite3.connect('metrics.db'
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM metrics'
    metrics = cursor.fetchall()

    return metrics

@app.get('/charts'
def read_charts():

    conn = sqlite3.connect('charts.db'
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM charts'
    charts = cursor.fetchall()

    return charts

@app.get('/filter'
def read_filter():

    conn = sqlite3.connect('filter.db'
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM filter'
    filter = cursor.fetchall()

    return filter

@app.get('/table'
def read_table():

    conn = sqlite3.connect('table.db'
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM table'
    table = cursor.fetchall()

    return table
