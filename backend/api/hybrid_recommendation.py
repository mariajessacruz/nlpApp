from flask import Blueprint, request, jsonify
import json
import random
import requests

hybrid_recommendation_bp = Blueprint('hybrid_recommendation', __name__)

def load_user_profiles(use_real_model=False):
    if use_real_model:
        return load_profiles_from_model()
    else:
        with open('backend/data/user_profiles.json', 'r') as file:
            return json.load(file)

def fetch_book_from_google_api(book_id):
    GOOGLE_BOOKS_API_KEY = 'your_google_books_api_key_here'
    url = f"https://www.googleapis.com/books/v1/volumes?q={book_id}&key={GOOGLE_BOOKS_API_KEY}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        if 'items' in data and len(data['items']) > 0:
            return data['items'][0]['volumeInfo']
    return None

def get_model_ranking(features, use_real_model=False):
    if use_real_model:
        return recommendation_model.predict(features)
    else:
        return simple_placeholder_model(features)

def simple_placeholder_model(features):
    return sorted(features['books'], key=lambda x: random.random())

def hybrid_popular_books_recommendation(emotion, preferences, use_real_model=False):
    books = fetch_most_popular_books()
    features = prepare_features(emotion, preferences, books)
    ranked_books = get_model_ranking(features, use_real_model)
    return ranked_books

@hybrid_recommendation_bp.route('/api/hybrid_recommendation', methods=['POST'])
def hybrid_recommendation():
    try:
        data = request.get_json()
        emotion = data.get('emotion')
        preferences = data.get('preferences', [])

        print(f"Received emotion: {emotion}")
        print(f"Received preferences: {preferences}")

        # Load user profiles
        user_profiles = load_user_profiles(use_real_model=False)

        # Debugging: Check if user_profiles are loaded correctly
        print(f"User profiles loaded: {len(user_profiles)} profiles found.")

        # Find books reviewed by users with similar emotions
        matched_books = []
        for user in user_profiles:
            for review in user['reviews']:
                if any(e in review['emotions'] for e in emotion):
                    matched_books.append(review['book_id'])

        print(f"Matched books: {matched_books}")

        if not matched_books:
            return jsonify({"error": "No matching books found."}), 200

        # Fetch book details from Google Books API
        recommended_books = []
        for book_id in matched_books:
            book_info = fetch_book_from_google_api(book_id)
            if book_info:
                recommended_books.append({
                    "title": book_info.get('title'),
                    "author": book_info.get('authors', ["Unknown"])[0],
                    "category": book_info.get('categories', ["Uncategorized"])[0],
                    "thumbnail": book_info.get('imageLinks', {}).get('thumbnail', '')
                })

        print(f"Recommended books: {recommended_books}")

        return jsonify(recommended_books), 200

    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return jsonify({"error": "An error occurred during recommendation."}), 500
