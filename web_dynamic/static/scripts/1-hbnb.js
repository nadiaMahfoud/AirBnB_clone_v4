// Wait for the document to be ready before executing the script
$(document).ready(function () {
  // Define an empty object to store selected amenities
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
});
