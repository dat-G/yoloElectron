from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import cv2
import os
import numpy as np
import logging

print("Now Path:",os.getcwd())

app = Flask(__name__)
# app.logger.setLevel(logging.DEBUG)
CORS(app)

@app.before_request
def log_request_info():
    app.logger.debug('Request: %s %s %s', request.method, request.path, request.args)
    if request.files:
        for key in request.files:
            file = request.files[key]
            file.seek(0, 2)  # 移动到文件末尾
            size = file.tell()
            file.seek(0)  # 重置文件指针
            app.logger.debug('Received file: name=%s size=%d', file.filename, size)

model = YOLO("../model/best.pt")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        print("Getting predictions")
        file = request.files['image']
        file.seek(0, 2)
        file_size = file.tell()
        file.seek(0)
        app.logger.debug('Processing image: filename=%s size=%d', file.filename, file_size)
        img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)
        if img is None:
            app.logger.error('Invalid image data received')
            return jsonify({'error': 'Invalid image format'}), 400
        app.logger.debug(f'Image dimensions: {img.shape if img is not None else "N/A"}')
        results = model.predict(source=img, verbose=False)

        predictions = []
        for result in results:
            for box in result.boxes:
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                predictions.append({
                    'class': result.names[int(box.cls)],
                    'confidence': float(box.conf),
                    'bbox': [x1, y1, x2-x1, y2-y1]
                })
        
        return jsonify(predictions)
    
    except KeyError:
        app.logger.error('Missing image file in request')
        return jsonify({'error': 'Missing image field'}), 400
    except Exception as e:
        app.logger.error(f'Prediction error: {str(e)}')
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # app.run(port=10404, debug=True, host='0.0.0.0')
    app.run(port=10404, debug=False, host='0.0.0.0')