# # backend/app.py
# from fastapi import FastAPI
# from pydantic import BaseModel

# app = Fastapi()

# class Item(BaseModel):
#     name: str
#     description: str

# @app.get("/api/hello")
# def read_root():
#     return {"message": "Hello from Python backend"}

# @app.post("/api/items")
# def create_item(item: Item):
#     return {"received": item}
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="8000", port=8000)   


from flask import Flask, render_template, request, jsonify, send_file
import os
import json
from datetime import datetime

app = Flask(__name__)

# Sample data for different pages
KOLAM_DATA = {
    'patterns': [
        {'name': 'Lotus Sikku Kolam', 'description': 'Continuous line pattern forming sacred lotus petals', 'size': 7},
        {'name': 'Featval Diwali Kolam', 'description': 'Illustrated pattern with lamp and flame motifs', 'size': 9},
        {'name': 'Traditional Star Kolam', 'description': 'Classic star pattern with radial symmetry', 'size': 5}
    ],
    'gallery': [
        {'title': 'Traditional Patterns', 'count': 45},
        {'title': 'Festival Specials', 'count': 23},
        {'title': 'Mathematical Designs', 'count': 18}
    ]
}

@app.route('/')
def home():
    return render_template('index.html', active_page='home')

@app.route('/kolam')
def kolam():
    return render_template('kolam.html', active_page='kolam', patterns=KOLAM_DATA['patterns'])

@app.route('/culture-heritage')
def culture_heritage():
    return render_template('culture_heritage.html', active_page='culture-heritage')

@app.route('/mathematical-significance')
def mathematical_significance():
    return render_template('mathematical_significance.html', active_page='mathematical-significance')

@app.route('/analyse-kolam')
def analyse_kolam():
    return render_template('analyse_kolam.html', active_page='analyse-kolam')

@app.route('/gallery')
def gallery():
    return render_template('gallery.html', active_page='gallery', gallery=KOLAM_DATA['gallery'])

# API endpoints for Kolam operations
@app.route('/api/generate-kolam', methods=['POST'])
def generate_kolam():
    try:
        data = request.get_json()
        size = data.get('size', 7)
        
        # Simulate kolam generation
        kolam_pattern = {
            'name': f'Generated Kolam {datetime.now().strftime("%H:%M:%S")}',
            'size': size,
            'pattern': simulate_kolam_generation(size),
            'timestamp': datetime.now().isoformat()
        }
        
        return jsonify({'success': True, 'pattern': kolam_pattern})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/analyze-kolam', methods=['POST'])
def analyze_kolam():
    try:
        # Handle image upload and analysis
        if 'image' in request.files:
            image_file = request.files['image']
            # Simulate analysis
            analysis_result = {
                'dot_count': 390,
                'contour_count': 68,
                'grid_size': '6×9',
                'symmetry': 'Yes',
                'complexity': 'High'
            }
            return jsonify({'success': True, 'analysis': analysis_result})
        else:
            return jsonify({'success': False, 'error': 'No image uploaded'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/export-kolam', methods=['POST'])
def export_kolam():
    try:
        data = request.get_json()
        format_type = data.get('format', 'svg')
        pattern_data = data.get('pattern', {})
        
        # Simulate export functionality
        filename = f"kolam_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.{format_type}"
        
        return jsonify({
            'success': True, 
            'message': f'Kolam exported as {format_type.upper()}',
            'filename': filename
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

def simulate_kolam_generation(size):
    """Simulate kolam pattern generation"""
    import random
    patterns = [
        {'type': 'geometric', 'complexity': 'medium', 'symmetry': 'radial'},
        {'type': 'floral', 'complexity': 'high', 'symmetry': 'bilateral'},
        {'type': 'abstract', 'complexity': 'low', 'symmetry': 'asymmetric'}
    ]
    return random.choice(patterns)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)