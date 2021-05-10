from flask import jsonify, request
from app import app
from app.APIs.Prediction import Prediction
import json
import boto3

@app.route('/')
def index():
    return "Hello, Python!"

@app.route('/predict', methods = ['GET', 'POST'])
def predict_summary():	

	app.logger.info('---SUMMARY GENERATION---')
	app.logger.info('request.data',request.data)
	review_id_json = json.loads(request.data)
	review_id = review_id_json.get("reviewId")
	app.logger.info('reviewId: ',str(review_id))

	client = boto3.resource("dynamodb",region_name='us-east-1')
	table = client.Table("review_analysis")

	response = table.get_item(
        Key={
            'reviewId':review_id
        }
    )
	app.logger.info(response.get('Item').get('input_json'))
	review_json = json.dumps(json.loads(response.get('Item').get('input_json')))

	prediction=Prediction()
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

	response = table.put_item(
        Item={
            'reviewId':review_id,
            'output_json':output_json
        }
    )
	app.logger.info('Returned output json',output_json)

	return 'Success'
