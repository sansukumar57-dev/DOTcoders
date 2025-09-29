# # import cv2
# # import numpy as np
# # import io
# # from flask import Flask, request, jsonify, send_file
# # from flask_cors import CORS
# # import tempfile
# # import image_rec as kolam_recognition
# # import kolam_recreator as kolam_recreation
# # from kolam_recreator import recreate_kolam_turtle

# # app = Flask(__name__)
# # CORS(app)

# # @app.route('/')
# # def home():
# #     return send_file('ui.html')


# # @app.route('/analyze', methods=['POST'])
# # def analyze_image():
# #     if 'image' not in request.files:
# #         return jsonify({'error': 'No image file provided'}), 400
    
# #     file = request.files['image']
# #     in_memory_file = io.BytesIO()
# #     file.save(in_memory_file)
# #     data = np.frombuffer(in_memory_file.getvalue(), dtype=np.uint8)
# #     img = cv2.imdecode(data, cv2.IMREAD_COLOR)

# #     if img is None:
# #         return jsonify({'error': 'Invalid image file'}), 400

# #     # Use a temporary file to avoid collisions
# #     with tempfile.NamedTemporaryFile(suffix='.png') as tmp:
# #         cv2.imwrite(tmp.name, img)
# #         dots, _ = kolam_recognition.detect_dots(tmp.name)
# #         contours, _ = kolam_recognition.detect_contours(tmp.name)
# #         principles = kolam_recognition.analyze_principles(dots, contours, img.shape)

# #     return jsonify(principles)


# # @app.route('/recreate', methods=['POST'])
# # def recreate_image():
# #     if 'image' not in request.files:
# #         return jsonify({'error': 'No image file provided'}), 400

# #     file = request.files['image']
# #     in_memory_file = io.BytesIO()
# #     file.save(in_memory_file)
# #     data = np.frombuffer(in_memory_file.getvalue(), dtype=np.uint8)
# #     img = cv2.imdecode(data, cv2.IMREAD_COLOR)

# #     if img is None:
# #         return jsonify({'error': 'Invalid image file'}), 400

# #     with tempfile.NamedTemporaryFile(suffix='.png') as tmp:
# #         cv2.imwrite(tmp.name, img)
# #         contours, _ = kolam_recognition.detect_contours(tmp.name)
# #        # recreated = kolam_recreation.recreate_kolam(contours, img.shape)
# #         recreated_path = recreate_kolam_turtle(contours, img.shape)

# #     return send_file(recreated_path, mimetype='image/png', as_attachment=False)
# #     # _, img_encoded = cv2.imencode('.png', recreated)  # pyright: ignore[reportUnreachable]
# #     # return send_file(io.BytesIO(img_encoded.tobytes()), mimetype='image/png', as_attachment=False)


# # if __name__ == '__main__':
# #     print("Starting server at http://127.0.0.1:5000")
# #     app.run(debug=False)
# import cv2
# import numpy as np
# import io, tempfile
# from flask import Flask, request, jsonify, send_file
# from flask_cors import CORS

# import image_rec as kolam_recognition
# from kolam_recreator import recreate_kolam_svg

# app = Flask(__name__)
# CORS(app)

# @app.route('/')
# def home():
#     return send_file('ui.html')

# @app.route('/analyze', methods=['POST'])
# def analyze_image():
#     if 'image' not in request.files:
#         return jsonify({'error': 'No image provided'}), 400

#     file = request.files['image']
#     in_memory_file = io.BytesIO()
#     file.save(in_memory_file)
#     data = np.frombuffer(in_memory_file.getvalue(), dtype=np.uint8)
#     img = cv2.imdecode(data, cv2.IMREAD_COLOR)

#     if img is None:
#         return jsonify({'error': 'Invalid image file'}), 400

#     with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp:
#         tmp.write(in_memory_file.getvalue())
#         tmp_path = tmp.name

#     dots, _ = kolam_recognition.detect_dots(tmp_path)
#     contours, _ = kolam_recognition.detect_contours(tmp_path)
#     principles = kolam_recognition.analyze_principles(dots, contours, img.shape)

#     return jsonify(principles)

# @app.route('/recreate', methods=['POST'])
# def recreate_image_svg():
#     if 'image' not in request.files:
#         return jsonify({'error': 'No image provided'}), 400

#     file = request.files['image']
#     in_memory_file = io.BytesIO()
#     file.save(in_memory_file)
#     data = np.frombuffer(in_memory_file.getvalue(), dtype=np.uint8)
#     img = cv2.imdecode(data, cv2.IMREAD_COLOR)

#     if img is None:
#         return jsonify({'error': 'Invalid image file'}), 400

#     with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp:
#         tmp.write(in_memory_file.getvalue())
#         tmp_path = tmp.name

#     contours, _ = kolam_recognition.detect_contours(tmp_path)

#     # Optional: Customize colors here
#     stroke_color = request.form.get('stroke_color', 'black')
#     dot_color = request.form.get('dot_color', 'red')
#     stroke_width = int(request.form.get('stroke_width', 2))
#     dot_radius = int(request.form.get('dot_radius', 3))

#     svg_path = tmp_path.replace(".png", "_kolam.svg")
#     recreate_kolam_svg(contours, img.shape, save_path=svg_path,
#                        stroke_color=stroke_color, dot_color=dot_color,
#                        stroke_width=stroke_width, dot_radius=dot_radius)

#     return send_file(svg_path, mimetype='image/svg+xml', as_attachment=False)

# if __name__ == '__main__':
#     # Runs the Flask app on http://127.0.0.1:5000
#     print("Starting Flask server... Open http://127.0.0.1:5000 in your browser.")
#     app.run(debug=False)
import cv2
import numpy as np
import io, tempfile
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS

import image_rec as kolam_recognition
from kolam_recreator import recreate_kolam_svg

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return send_file('ui.html')

@app.route('/analyze', methods=['POST'])
def analyze_image():
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

    dots, _ = kolam_recognition.detect_dots(tmp_path)
    contours, _ = kolam_recognition.detect_contours(tmp_path)
    principles = kolam_recognition.analyze_principles(dots, contours, img.shape)

    return jsonify(principles)

@app.route('/recreate', methods=['POST'])
def recreate_image_svg():
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

    contours, _ = kolam_recognition.detect_contours(tmp_path)

    # Customization
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
    print("Flask server running at http://127.0.0.1:5000")
    app.run(debug=True)
