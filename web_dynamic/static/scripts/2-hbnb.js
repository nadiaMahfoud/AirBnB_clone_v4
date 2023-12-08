// Execute when the document is ready
$(document).ready(function () {
  // Object to store selected amenities
  const selectedAmenities = {};

  // Event handler for checkbox change
  $('li input[type=checkbox]').change(function () {
    // Check if the checkbox is checked
    if (this.checked) {
      // Add the amenity to the selectedAmenities object
      selectedAmenities[this.dataset.name] = this.dataset.id;
    } else {
      // Remove the amenity from the selectedAmenities object
      delete selectedAmenities[this.dataset.name];
    }
    // Update the text in the amenities section with sorted amenity names
    $('.amenities h4').text(Object.keys(selectedAmenities).sort().join(', '));
  });

  // Get the status of the API
  $.getJSON('http://0.0.0.0:5001/api/v1/status/', function (data) {
    // Check if the API status is "OK" and update the class of div#api_status accordingly
    if (data.status === 'OK') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });
});
