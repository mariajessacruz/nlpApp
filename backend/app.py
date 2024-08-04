from flask import Flask, request, jsonify
import json

app = Flask(__name__)

# Load user profile data from JSON
with open('data/user_profiles.json') as f:
    user_profiles = json.load(f)

# In-memory storage for emotions (this could be a database in a real application)
user_emotions = {}

# Endpoint to save selected emotion
@app.route('/api/save_emotion', methods=['POST'])
def save_emotion():
    user_id = request.json.get('user_id')
    emotion_id = request.json.get('emotion_id')
    print(f"Received sdvasdv ID: {emotion_id} for user {user_id}")  
    if user_id and emotion_id is not None:
        if user_id not in user_emotions:
            user_emotions[user_id] = []
        user_emotions[user_id].append(emotion_id)
        print(f"Received  sasdvas emotion ID: {emotion_id} for user {user_id}")  # Log the emotion ID in the backend
        return jsonify(success=True, message=f"Emotion ID {emotion_id} received and saved."), 200

    return jsonify(success=False, message="Invalid data"), 400

# Endpoint to get book recommendations based on selected emotions
@app.route('/api/get_books_by_emotion', methods=['POST'])
def get_books_by_emotion():
    emotion_ids = request.json.get('emotion_ids', [])
    user_id = request.json.get('user_id')
    print(f"Received  sfasv sdfadv emotion ID: {emotion_id} for user {user_id}")  
    
    if not emotion_ids or not user_id:
        return jsonify(success=False, books=[]), 400

    recommended_books = fetch_recommendations_from_json(user_id, emotion_ids)
    return jsonify(success=True, books=recommended_books), 200

def fetch_recommendations_from_json(user_id, emotion_ids):
    print(f"Received emsvasda otion ID: {emotion_ids} for user {user_id}")  
    
    recommended_books = []
    
    for profile in user_profiles:
        if profile['user_id'] != user_id:
            for review in profile['reviews']:
                if any(emotion in emotion_ids for emotion in review['emotions']):
                    recommended_books.append(review['book_id'])

    return list(set(recommended_books))

if __name__ == '__main__':
    app.run(debug=True)
