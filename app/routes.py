from flask import jsonify, request
from app import app
from app.APIs.Prediction import Prediction
import json
from pymongo import MongoClient

@app.route('/')
def index():
    return "Hello, Python!"

@app.route('/predict', methods = ['GET', 'POST'])
def predict_summary():	

	app.logger.info('---SUMMARY GENERATION---')
	prediction=Prediction()
	review_json = json.dumps(json.loads(request.data))
	app.logger.info(review_json)
	positive_reviews, negative_reviews, all_reviews,number_of_positive_reviews, number_of_negative_reviews,total_number_of_reviews=prediction.readContent(review_json)
	app.logger.info('Starting to generate summaries')	

	positive_summary=prediction.generate_summary(positive_reviews)
	app.logger.info('Generated positive summary')

	negative_summary=prediction.generate_summary(negative_reviews)
	app.logger.info('Generated negative summary')

	app.logger.info('---KEYWORD EXTRACTION---')
	keywords= prediction.get_keywords(all_reviews)
	app.logger.info('Keywords extracted')

	output_json= json.dumps({'positive_summary':positive_summary, 'negative_summary': negative_summary, 'keywords': keywords,
	'number_of_positive_reviews':number_of_positive_reviews,'number_of_negative_reviews': number_of_negative_reviews,
	'total_number_of_reviews':total_number_of_reviews})

	app.logger.info('Returned output json',output_json)
	# client = MongoClient('localhost', 27017)
	# db = client['amazon_reviews_data']
	# collection_data = db['reviews_json']
	# collection_data.insert_one(output_json)
	# client.close()

	return output_json
