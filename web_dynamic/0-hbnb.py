#!/usr/bin/python3
""" The following module starts a Flask Web Application """

# Import necessary modules and classes
from models import storage
from models.state import State
from models.city import City
from models.amenity import Amenity
from models.place import Place
from os import environ
from flask import Flask, render_template
import uuid

# Create a Flask application instance
app = Flask(__name__)
# app.jinja_env.trim_blocks = True
# app.jinja_env.lstrip_blocks = True


# Define a function to close the database connection after each request
@app.teardown_appcontext
def close_db(error):
    """ this method closes the current SQLAlchemy Session """
    storage.close()


# Define a route for the '/0-hbnb/' endpoint
@app.route('/0-hbnb/', strict_slashes=False)
def hbnb():
    """ This method defines the HBNB """

    # Retrieve all states from the database and sort them alphabetically
    all_states = storage.all(State).values()
    sorted_states = sorted(all_states, key=lambda state: state.name)
    state_city_list = []

    # Create a list of states and their respective cities
    for state in sorted_states:
        state_city_list.append(
                [state, sorted(state.cities, key=lambda city: city.name)])

    # Retrieve all amenities from the database and sort them alphabetically
    all_amenities = storage.all(Amenity).values()
    sorted_amenities = sorted(all_amenities, key=lambda amenity: amenity.name)

    # Retrieve all places from the database and sort them alphabetically
    all_places = storage.all(Place).values()
    sorted_places = sorted(all_places, key=lambda place: place.name)

    # Render the HTML template with the data obtained from the database
    return render_template('0-hbnb.html',
                           states=state_city_list,
                           amenities=sorted_amenities,
                           places=sorted_places,
                           cache_id=uuid.uuid4())


# Run the Flask application if the script is executed directly
if __name__ == "__main__":
    """ Main Function """
    app.run(host='0.0.0.0', port=5001)
