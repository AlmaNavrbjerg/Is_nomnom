from flask import Flask, request, jsonify, render_template
import requests

import os
from dotenv import load_dotenv
import psycopg

load_dotenv()  # Load environment variables from .env file

DATABASE_URL = os.getenv("DATABASE_URL")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ULTRA_SECRET_KEY = os.getenv("SUPABASE_ULTRA_SECRET_KEY")

SUPABASE_HEADERS = {
    "apikey": SUPABASE_ULTRA_SECRET_KEY,
    "Authorization": f"Bearer {SUPABASE_ULTRA_SECRET_KEY}"
}

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('home.html')

def get_conn():
    return psycopg.connect(DATABASE_URL)
    
@app.route('/api/locations', methods=['GET'])
def get_locations():
    
    url = f"{SUPABASE_URL}/rest/v1/shops"
    response = requests.get(url, headers=SUPABASE_HEADERS)
    return jsonify(response.json())

if __name__ == '__main__':
    app.run(debug=True)
