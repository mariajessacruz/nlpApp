# backend/app.py
from flask import Flask, jsonify
from api.hybrid_recommendation import hybrid_recommendation_bp

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Flask API"})

# Register the blueprint
app.register_blueprint(hybrid_recommendation_bp)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)