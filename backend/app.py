import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
from google.genai import types
from werkzeug.utils import secure_filename

app = Flask(__name__, static_folder='../frontend/out', static_url_path='/')
CORS(app)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/<path:path>')
def serve_static(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return app.send_static_file(path)
    else:
        return app.send_static_file('index.html')

@app.route('/api/parse', methods=['POST'])
def parse_prescription():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file format. Please upload jpeg, png, or webp.'}), 400

    api_key = os.environ.get('GEMINI_API_KEY')
    if not api_key:
        return jsonify({'error': 'GEMINI_API_KEY is not configured on the server.'}), 500

    try:
        # Read the file data
        file_data = file.read()
        
        client = genai.Client(api_key=api_key)
        
        system_instruction = """
You are a medical data extraction expert. Extract the medication schedule from the uploaded image.
Respond STRICTLY with a JSON object containing a `medications` array. 
Each item in the array must have `name`, `dosage`, and `frequency`. 
Do not include markdown blocks or any other text outside the JSON.
        """
        
        response = client.models.generate_content(
            model='gemini-1.5-flash',
            contents=[
                types.Part.from_bytes(data=file_data, mime_type=file.mimetype),
                "Extract the medical data and output as JSON."
            ],
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                response_mime_type="application/json"
            )
        )
        
        data = json.loads(response.text)
        return jsonify(data)
        
    except Exception as e:
        print(f"Error parsing image: {e}")
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)
