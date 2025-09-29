# backend/app.py
from fastapi import FastAPI
from pydantic import BaseModel
 from flask import Flask, render_template, redirect, url_for

app = Flask(__name__)


class Item(BaseModel):
    name: str
    description: str

@app.get("/api/hello")
def read_root():
    return {"message": "Hello from Python backend"}

@app.post("/api/items")
def create_item(item: Item):
    return {"received": item}

    
    
    
    
   

@app.route('/')
def home():
    return render_template('src/components/KolamEditor.tsx', active_page='home')

@app.route('/kolam')
def kolam():
    return render_template('src/components/KolamEditor.tsx', active_page='kolam')

@app.route('/culture-heritage')
def culture_heritage():
    return render_template('src/components/KolamEditor.tsx', active_page='culture-heritage')

@app.route('/mathematical-significance')
def mathematical_significance():
    return render_template('src/components/KolamEditor.tsx', active_page='mathematical-significance')

@app.route('/analyse-kolam')
def analyse_kolam():
    return render_template('src/components/KolamEditor.tsx', active_page='analyse-kolam')

@app.route('/gallery')
def gallery():
    return render_template('src/components/KolamEditor.tsx', active_page='gallery')

# API routes for the Kolam generator
@app.route('/api/generate-kolam', methods=['POST'])
def generate_kolam():
    # Kolam generation logic here
    return {'pattern': 'generated_pattern_data'}

@app.route('/api/analyze-kolam', methods=['POST'])
def analyze_kolam_api():
    # Kolam analysis logic here
    return {'analysis': 'analysis_results'}

if __name__ == '__main__':
    app.run(debug=True)
    import uvicorn
    
    uvicorn.run(app, host="8000", port=8000)
    
    
    