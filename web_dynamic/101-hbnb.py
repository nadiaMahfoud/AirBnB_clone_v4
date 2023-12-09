#!/usr/bin/python3
""" Starts a Flash Web Application """
# Import necessary modules and classes
from models import storage
from models.state import State
from models.city import City
from models.amenity import Amenity
from models.place import Place
from os import environ
from flask import Flask, render_template
import uuid
# Create a Flask application
app = Flask(__name__)
# app.jinja_env.trim_blocks = True
# app.jinja_env.lstrip_blocks = True


# Define a teardown function to close the SQLAlchemy session
@app.teardown_appcontext
def close_db(error):
    """ Remove the current SQLAlchemy Session """
    storage.close()


# Define a route for the HBNB page
@app.route('/101-hbnb/', strict_slashes=False)
def hbnb():
    """ HBNB is alive! """
    # Retrieve all states from the storage
    stateId = storage.all(State).values()
    stateId = sorted(stateId, key=lambda k: k.name)
    st_ct = []
    # Create a list of states with sorted cities for each state
    for state in stateId:
        st_ct.append([state, sorted(state.cities, key=lambda k: k.name)])
    # Retrieve all amenities from the storage
    amenityId = storage.all(Amenity).values()
    amenityId = sorted(amenityId, key=lambda k: k.name)
    # Retrieve all places from the storage
    placeID = storage.all(Place).values()
    placeID = sorted(placeID, key=lambda k: k.name)
    # Render the HBNB template with the retrieved data
    return render_template('0-hbnb.html',
                           stateId=st_ct,
                           amenityId=amenityId,
                           placeID=placeID,
                           cache_id=uuid.uuid4())


# Run the application if the script is executed directly
if __name__ == "__main__":
    """ Main Function """
    app.run(host='0.0.0.0', port=5001)
