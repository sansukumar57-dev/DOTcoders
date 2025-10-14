import cv2
import numpy as np
import io
import tempfile
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from sklearn.cluster import DBSCAN
from xml.etree.ElementTree import Element, SubElement, tostring

app = Flask(__name__)
CORS(app)

# ===== IMAGE RECOGNITION FUNCTIONS =====
def detect_dots(image_path):
    """Detect dots in Kolam image using blob detection"""
    img = cv2.imread(image_path)
    if img is None:
        return None, None

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                   cv2.THRESH_BINARY_INV, 11, 2)
    thresh = 255 - thresh

    params = cv2.SimpleBlobDetector_Params()
    params.filterByArea = True
    params.minArea = 5
    params.maxArea = 150
    params.filterByCircularity = True
    params.minCircularity = 0.6
    params.filterByConvexity = True
    params.minConvexity = 0.85
    params.filterByInertia = True
    params.minInertiaRatio = 0.1

    detector = cv2.SimpleBlobDetector_create(params)
    keypoints = detector.detect(thresh)
    return keypoints, img

def detect_contours(image_path):
    """Detect contours in Kolam image"""
    img = cv2.imread(image_path)
    if img is None:
        return None, None

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    thresh = cv2.inRange(gray, 200, 255)
    contours, _ = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

    filtered = [c for c in contours if cv2.contourArea(c) > 50]
    return filtered, img

def analyze_principles(keypoints, contours, image_shape):
    """Analyze Kolam design principles"""
    if not keypoints:
        return {"error": "No dots detected"}

    coords = np.array([kp.pt for kp in keypoints])
    if len(coords) > 1:
        num_rows = len(set(DBSCAN(eps=10, min_samples=1).fit(coords[:,1].reshape(-1,1)).labels_))
        num_cols = len(set(DBSCAN(eps=10, min_samples=1).fit(coords[:,0].reshape(-1,1)).labels_))
    else:
        num_rows = num_cols = 1

    mid_x = image_shape[1] / 2
    left_dots = sum(1 for kp in keypoints if kp.pt[0] < mid_x)
    right_dots = sum(1 for kp in keypoints if kp.pt[0] > mid_x)
    is_symmetric = abs(left_dots - right_dots) <= max(2, len(keypoints)*0.1)

    return {
        "dot_count": len(keypoints),
        "contour_count": len(contours) if contours is not None else 0,
        "grid": {"rows": num_rows, "cols": num_cols},
        "is_symmetric": is_symmetric,
        "dots": coords.tolist()
    }

# ===== KOLAM RECREATION FUNCTIONS =====
def recreate_kolam_svg(contours, image_shape, save_path="recreated_kolam.svg",
                       stroke_color="black", dot_color="red",
                       stroke_width=2, dot_radius=3):
    """
    Recreates a Kolam as an SVG with contours and decorative dots
    """
    height, width = image_shape[:2] if len(image_shape) == 3 else image_shape

    svg = Element('svg', xmlns="http://www.w3.org/2000/svg",
                  width=str(width), height=str(height),
                  viewBox=f"0 0 {width} {height}")

    # Draw contours
    for contour in contours:
        if len(contour) == 0:
            continue

        points = " ".join(f"{pt[0][0]},{pt[0][1]}" for pt in contour)
        SubElement(svg, 'polyline', points=points,
                   stroke=stroke_color, fill="none", stroke_width=str(stroke_width))

        # Add decorative dots for circular contours
        area = cv2.contourArea(contour)
        perimeter = cv2.arcLength(contour, True)
        if perimeter > 0:
            circularity = (4 * 3.14159 * area) / (perimeter * perimeter)
            if circularity > 0.6 and 100 < area < 5000:
                M = cv2.moments(contour)
                if M["m00"] != 0:
                    cX = int(M["m10"] / M["m00"])
                    cY = int(M["m01"] / M["m00"])
                    SubElement(svg, 'circle', cx=str(cX), cy=str(cY),
                               r=str(dot_radius), fill=dot_color)

    # Save SVG file
    with open(save_path, "wb") as f:
        f.write(tostring(svg))

    return save_path

# ===== FLASK ROUTES =====
@app.route('/')
def home():
    """Serve the main UI"""
    return """
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>🌸 Kolam Analyzer & Recreator 🌸</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; margin:0; padding:20px; background: #F5E6D3; }
        .container { max-width: 900px; margin:auto; background:#fff; padding:20px; border-radius:15px; box-shadow:0 5px 15px rgba(0,0,0,0.1);}
        h1 { text-align:center; color:#8B4513; margin-bottom:20px;}
        .upload-zone { border:3px dashed #A0522D; padding:40px; text-align:center; cursor:pointer; margin-bottom:20px; border-radius:15px; transition:0.3s;}
        .upload-zone.dragover { background:rgba(160,82,45,0.1);}
        .uploaded-image img { max-width:100%; border-radius:10px; }
        .button-group { display:flex; justify-content:center; gap:20px; margin-bottom:20px;}
        button { padding:10px 25px; border:none; border-radius:25px; background:#A0522D; color:#fff; font-weight:bold; cursor:pointer; transition:0.3s;}
        button:disabled { background: rgba(160,82,45,0.4); cursor:not-allowed;}
        .results { display:flex; gap:20px; justify-content:space-around; flex-wrap:wrap;}
        .result-box { background: #fff3e6; padding:20px; border-radius:15px; width:45%; text-align:center; }
        .result-box img, .result-box svg { max-width:100%; border-radius:10px; }
        .color-options { display:flex; justify-content:center; gap:15px; margin-top:10px; flex-wrap:wrap;}
        .color-options label { display:flex; flex-direction:column; font-size:0.9rem; color:#6B3E1F;}
    </style>
    </head>
    <body>

    <div class="container">
        <h1>🌸 Kolam Analyzer & Recreator 🌸</h1>

        <!-- Upload Section -->
        <div class="upload-zone" id="uploadZone">
            <p>Drag & drop or click to upload a Kolam image</p>
            <input type="file" id="imageInput" accept="image/*" style="display:none;">
            <div class="uploaded-image" id="uploadedImage" style="display:none;">
                <img id="previewImage">
                <button onclick="removeImage()">✕</button>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="button-group">
            <button id="analyzeBtn" disabled onclick="startAnalysis()">Analyze</button>
            <button id="recreateBtn" disabled onclick="startRecreation()">Recreate</button>
        </div>

        <!-- Color & Size Options -->
        <div class="color-options">
            <label>Line Color: <input type="color" id="strokeColor" value="#000000"></label>
            <label>Dot Color: <input type="color" id="dotColor" value="#ff0000"></label>
            <label>Line Width: <input type="number" id="strokeWidth" value="2" min="1"></label>
            <label>Dot Radius: <input type="number" id="dotRadius" value="3" min="1"></label>
        </div>

        <!-- Results -->
        <div class="results">
            <div class="result-box" id="analysisResults" style="display:none;">
                <h3>Analysis</h3>
                <div id="resultsGrid"></div>
            </div>
            <div class="result-box" id="recreationResults" style="display:none;">
                <h3>Recreation</h3>
                <div id="recreatedImageContainer"></div>
            </div>
        </div>
    </div>

    <script>
    const uploadZone = document.getElementById('uploadZone');
    const imageInput = document.getElementById('imageInput');
    const uploadedImageContainer = document.getElementById('uploadedImage');
    const previewImage = document.getElementById('previewImage');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const recreateBtn = document.getElementById('recreateBtn');
    const resultsGrid = document.getElementById('resultsGrid');
    const recreatedImageContainer = document.getElementById('recreatedImageContainer');
    const analysisResults = document.getElementById('analysisResults');
    const recreationResults = document.getElementById('recreationResults');

    let currentFile = null;

    // --- Upload Handlers ---
    uploadZone.addEventListener('click', () => imageInput.click());
    uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('dragover'); });
    uploadZone.addEventListener('dragleave', e => { e.preventDefault(); uploadZone.classList.remove('dragover'); });
    uploadZone.addEventListener('drop', e => { e.preventDefault(); uploadZone.classList.remove('dragover'); handleUpload(e.dataTransfer.files[0]); });
    imageInput.addEventListener('change', e => handleUpload(e.target.files[0]));

    function handleUpload(file){
        if(!file.type.startsWith('image/')) return alert('Not an image.');
        currentFile = file;
        previewImage.src = URL.createObjectURL(file);
        uploadedImageContainer.style.display='block';
        analyzeBtn.disabled=false;
        recreateBtn.disabled=false;
    }

    function removeImage(){
        currentFile=null;
        uploadedImageContainer.style.display='none';
        analyzeBtn.disabled=true;
        recreateBtn.disabled=true;
        resultsGrid.innerHTML='';
        recreatedImageContainer.innerHTML='';
        analysisResults.style.display='none';
        recreationResults.style.display='none';
    }

    // --- Analysis ---
    async function startAnalysis(){
        if(!currentFile) return;
        analyzeBtn.disabled=true; recreateBtn.disabled=true;

        const formData = new FormData();
        formData.append('image', currentFile);

        try{
            const resp = await fetch('/analyze', { method:'POST', body: formData });
            if(!resp.ok) throw new Error('Analysis failed');
            const data = await resp.json();
            displayAnalysis(data);
        } catch(e){ alert('Analysis error'); console.error(e); }
        finally{ analyzeBtn.disabled=false; recreateBtn.disabled=false; }
    }

    function displayAnalysis(data){
        resultsGrid.innerHTML='';
        const principles = {
            "Dot Count": data.dot_count,
            "Contour Count": data.contour_count,
            "Grid": `${data.grid.rows} x ${data.grid.cols}`,
            "Symmetric": data.is_symmetric?'Yes':'No'
        };
        for(const [k,v] of Object.entries(principles)){
            const div = document.createElement('div');
            div.textContent = `${k}: ${v}`;
            resultsGrid.appendChild(div);
        }
        analysisResults.style.display='block';
        recreationResults.style.display='none';
    }

    // --- Recreation (SVG) ---
    async function startRecreation(){
        if(!currentFile) return;
        recreateBtn.disabled=true; analyzeBtn.disabled=true;

        const formData = new FormData();
        formData.append('image', currentFile);
        formData.append('stroke_color', document.getElementById('strokeColor').value);
        formData.append('dot_color', document.getElementById('dotColor').value);
        formData.append('stroke_width', document.getElementById('strokeWidth').value);
        formData.append('dot_radius', document.getElementById('dotRadius').value);

        try{
            const resp = await fetch('/recreate', { method:'POST', body:formData });
            if(!resp.ok) throw new Error('Recreation failed');
            const svgText = await resp.text();
            displayRecreatedSVG(svgText);
        } catch(e){ alert('Recreation error'); console.error(e); }
        finally{ recreateBtn.disabled=false; analyzeBtn.disabled=false; }
    }

    function displayRecreatedSVG(svgContent){
        recreatedImageContainer.innerHTML = svgContent;
        recreationResults.style.display='block';
        analysisResults.style.display='none';
    }
    </script>
    </body>
    </html>
    """

@app.route('/analyze', methods=['POST'])
def analyze_image():
    """Analyze Kolam image and return design principles"""
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    file = request.files['image']
    in_memory_file = io.BytesIO()
    file.save(in_memory_file)
    data = np.frombuffer(in_memory_file.getvalue(), dtype=np.uint8)
    img = cv2.imdecode(data, cv2.IMREAD_COLOR)

    if img is None:
        return jsonify({'error': 'Invalid image file'}), 400

    with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp:
        tmp.write(in_memory_file.getvalue())
        tmp_path = tmp.name

    dots, _ = detect_dots(tmp_path)
    contours, _ = detect_contours(tmp_path)
    principles = analyze_principles(dots, contours, img.shape)

    return jsonify(principles)

@app.route('/recreate', methods=['POST'])
def recreate_image_svg():
    """Recreate Kolam as SVG with customizable styling"""
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    file = request.files['image']
    in_memory_file = io.BytesIO()
    file.save(in_memory_file)
    data = np.frombuffer(in_memory_file.getvalue(), dtype=np.uint8)
    img = cv2.imdecode(data, cv2.IMREAD_COLOR)

    if img is None:
        return jsonify({'error': 'Invalid image file'}), 400

    with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp:
        tmp.write(in_memory_file.getvalue())
        tmp_path = tmp.name

    contours, _ = detect_contours(tmp_path)

    # Customization options
    stroke_color = request.form.get('stroke_color', 'black')
    dot_color = request.form.get('dot_color', 'red')
    stroke_width = int(request.form.get('stroke_width', 2))
    dot_radius = int(request.form.get('dot_radius', 3))

    svg_path = tmp_path.replace(".png", "_kolam.svg")
    recreate_kolam_svg(contours, img.shape, save_path=svg_path,
                       stroke_color=stroke_color, dot_color=dot_color,
                       stroke_width=stroke_width, dot_radius=dot_radius)

    return send_file(svg_path, mimetype='image/svg+xml', as_attachment=False)

if __name__ == '__main__':
    print("🌸 Kolam Analyzer & Recreator 🌸")
    print("Flask server running at http://127.0.0.1:5000")
    app.run(debug=True)
