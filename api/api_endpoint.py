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


@app.route("/top_10_states")
def top_10_states():
    """Get the top 10 states with the most stations."""
    # Aggregation pipeline to count the number of stations per state
    pipeline = [
        {
            "$group": {
                "_id": "$State",        # Group by the 'State' field
                "station_count": {"$sum": 1}  # Count the number of stations in each state
            }
        },
        {
            "$sort": {"station_count": -1}  # Sort by station count in descending order
        },
        {
            "$limit": 10  # Limit to the top 10 states
        }
    ]
    
    # Execute the aggregation query
    top_10_states = collection.aggregate(pipeline)
    
    output = []
    for state in top_10_states:
        state['_id'] = str(state['_id'])  # Convert ObjectId to string if necessary
        output.append(state)
    
    return jsonify(output)


if __name__ == '__main__':
    app.run(debug=True)
