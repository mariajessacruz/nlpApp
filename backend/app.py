from flask import Flask
from api.hybrid_recommendation import hybrid_recommendation_bp

app = Flask(__name__)

# Register the hybrid_recommendation blueprint
app.register_blueprint(hybrid_recommendation_bp)

if __name__ == '__main__':
    app.run(debug=True)
