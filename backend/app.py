from flask import Flask, request, jsonify
import json
from supabase import create_client, Client
import os

app = Flask(__name__)

# Initialize Supabase client
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Load user profile data from JSON
try:
    with open('backend/data/user_profiles.json') as f:
        user_profiles = json.load(f)
except FileNotFoundError:
    user_profiles = {}

# Endpoint to check user status
@app.route('/backend/api/get_user_status', methods=['GET'])
def get_user_status():
    user_id = request.args.get('user_id')
    
    # Check in JSON file first
    if user_id and any(profile.get('user_id') == user_id for profile in user_profiles):
        user_profile = next(profile for profile in user_profiles if profile.get('user_id') == user_id)
        return jsonify(success=True, source='json', user_profile=user_profile), 200
    
    # Check in Supabase if not found in JSON
    response = supabase.table('user_profiles').select('*').eq('user_id', user_id).execute()
    if response.status_code == 200 and response.data:
        user_profile = response.data[0]
        return jsonify(success=True, source='supabase', user_profile=user_profile), 200
    
    return jsonify(success=False, message="User not found"), 404

# Endpoint to save selected emotion
@app.route('/backend/api/save_emotion', methods=['POST'])
def save_emotion():
    user_id = request.json.get('user_id')
    emotion_id = request.json.get('emotion_id')
    
    if user_id and emotion_id is not None:
        # Save emotion to Supabase
        data = {
            'user_id': user_id,
            'emotion_id': emotion_id
        }
        response = supabase.table('user_emotion_preferences').insert(data).execute()
        
        if response.status_code == 201:
            print(f"Received emotion ID: {emotion_id} for user {user_id}")  # Log the emotion ID in the backend
            return jsonify(success=True, message=f"Emotion ID {emotion_id} received and saved."), 200
        else:
            return jsonify(success=False, message="Error saving emotion to Supabase."), 400

    return jsonify(success=False, message="Invalid data"), 400

# Endpoint to get book recommendations based on selected emotions
@app.route('/backend/api/get_books_by_emotion', methods=['POST'])
def get_books_by_emotion():
    emotion_ids = request.json.get('emotion_ids', [])
    user_id = request.json.get('user_id')
    
    if not emotion_ids or not user_id:
        return jsonify(success=False, books=[]), 400

    # Fetch recommendations from both JSON and Supabase
    recommended_books = fetch_recommendations(user_id, emotion_ids)
    return jsonify(success=True, books=recommended_books), 200

def fetch_recommendations(user_id, emotion_ids):
    recommended_books = []

    # Fetch from JSON file
    for profile in user_profiles:
        if profile['user_id'] != user_id:
            for review in profile.get('reviews', []):
                if any(emotion in emotion_ids for emotion in review.get('emotions', [])):
                    recommended_books.append(review['book_id'])
    
    # Fetch from Supabase
    response = supabase.table('user_reviews').select('book_id, emotions').neq('user_id', user_id).execute()
    if response.status_code == 200:
        supabase_reviews = response.data
        for review in supabase_reviews:
            if any(emotion in emotion_ids for emotion in review.get('emotions', [])):
                recommended_books.append(review['book_id'])

    return list(set(recommended_books))

if __name__ == '__main__':
    app.run(debug=True)
