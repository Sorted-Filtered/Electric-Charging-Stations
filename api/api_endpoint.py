import numpy as np

from pymongo import MongoClient

from flask import Flask, jsonify


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


#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/stations<br/>"
    )


@app.route("/stations")
def stations():
    items = collection.find({})
    output = []
    for item in items:
        item['_id'] = str(item['_id'])  # Convert ObjectId to string
        output.append(item)
    return jsonify(output)


if __name__ == '__main__':
    app.run(debug=True)
