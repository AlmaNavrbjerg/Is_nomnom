from flask import Flask, request, jsonify, render_template
import requests

import os
from dotenv import load_dotenv

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ULTRA_SECRET_KEY = os.getenv("SUPABASE_ULTRA_SECRET_KEY")

SUPABASE_HEADERS = {
    "apikey": SUPABASE_ULTRA_SECRET_KEY,
    "Authorization": f"Bearer {SUPABASE_ULTRA_SECRET_KEY}"
}

app = Flask(__name__)

@app.route('/')
def home():
    return "Hello, World!"