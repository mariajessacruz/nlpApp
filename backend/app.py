from flask import Flask, send_from_directory, render_template, request, jsonify
import os

app = Flask(__name__, static_folder='../frontend/.next', template_folder='../frontend/.next')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/_next/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    emotion = data.get('emotion', None)
    query = data.get('query', None)
    
    # Example processing function to handle input
    input_data = preprocess_input(emotion, query)
    
    # Placeholder response
    predictions = {'status': 'success', 'data': input_data}
    return jsonify(predictions)

def preprocess_input(emotion, query):
    # Dummy processing logic - replace with the actual logic
    return {'emotion': emotion, 'query': query}

if __name__ == '__main__':
    app.run(debug=True)
