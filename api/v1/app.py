#!/usr/bin/python3
"""
This module is the flask Application for AirBnB Clone API
"""

from models import storage
from api.v1.views import app_views
from os import environ
from flask import Flask, render_template, make_response, jsonify
from flask_cors import CORS
from flasgger import Swagger
from flasgger.utils import swag_from


# Create a Flask application
app = Flask(__name__)


# Set the JSONIFY_PRETTYPRINT_REGULAR config to True for pretty JSON output
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True

# Register the app_views blueprint for API views
app.register_blueprint(app_views)

# Enable Cross-Origin Resource Sharing (CORS) for the API endpoints
cors = CORS(app, resources={r"/api/v1/*": {"origins": "*"}})


# Define a teardown function to close the storage connection after each request
@app.teardown_appcontext
def close_db(error):
    """
    This method closes storage connection after each request
    Args:
        error (Exception): Any exception that occurred during the request.
    """
    storage.close()


# Define an error handler for 404 errors
@app.errorhandler(404)
def not_found(error):
    """
    404 Error Handler
    Args:
        error (Exception): Any exception that occurred during the request
    Returns:
        response: A JSON resp indicating the requested resource was not found
    """
    return make_response(jsonify({'error': "Not found"}), 404)


# Configure Swagger for API documentation
app.config['SWAGGER'] = {
    'title': 'AirBnB Clone Restful API',
    'uiversion': 3
}

# Initialize Swagger extension
Swagger(app)


# Main function to run the application
if __name__ == "__main__":
    host = environ.get('HBNB_API_HOST')
    port = environ.get('HBNB_API_PORT')

    # Set default host and port if not provided in the environment
    if not host:
        host = '0.0.0.0'
    if not port:
        port = '5000'

    # Run the application
    app.run(host=host, port=port, threaded=True)
