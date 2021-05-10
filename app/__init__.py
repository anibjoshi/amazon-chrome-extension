from flask import Flask
import nltk
nltk.download('averaged_perceptron_tagger')
nltk.download('vader_lexicon')
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')
import logging

app = Flask(__name__)
# app.config.from_object(Config)

logging.basicConfig(level=logging.DEBUG)

from app import routes