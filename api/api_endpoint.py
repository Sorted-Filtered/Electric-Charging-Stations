import numpy as np

from pymongo import MongoClient

from flask import Flask, jsonify
from flask_cors import CORS, cross_origin


#################################################
# Database Setup
#################################################
mongo = MongoClient(port=27017)
db = mongo['electric_charging']
collection = db['stations']


#################################################
# Flask Setup
#################################################
app = Flask(__name__)
cors = CORS(app) # allow CORS for all domains on all routes.
app.config['CORS_HEADERS'] = 'Content-Type'


#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/stations/<state><br/>"
    )


@app.route("/stations/<state>")
def stations(state):
    query = {'State': state}
    items = collection.find(query)
    output = []
    for item in items:
        item['_id'] = str(item['_id'])  # Convert ObjectId to string
        output.append(item)
    return jsonify(output)


if __name__ == '__main__':
    app.run(debug=True)
