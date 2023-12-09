document.ready(function () {
	// Define the host URL
	const HOST = "http://127.0.0.1:5001";
	// Objects to store selected amenities, cities, and states
	const amenityId = {};
	const cityId = {};
	const stateId = {};
	// Event handler for checkbox change
	$('ul li input[type="checkbox"]').bind("change", (e) => {
		const el = e.target;
		let tt;
		// Determine the target object based on the checkbox type
		switch (el.id) {
			case "state_filter":
				tt = stateId;
				break;
			case "city_filter":
				tt = cityId;
				break;
			case "amenity_filter":
				tt = amenityId;
				break;
		}
		// Update the target object based on checkbox status
		if (el.checked) {
			tt[el.dataset.name] = el.dataset.id;
		} else {
			delete tt[el.dataset.name];
		}
		// Update the displayed text based on the checkbox type
		if (el.id === "amenity_filter") {
			$(".amenities h4").text(Object.keys(amenityId).sort().join(", "));
		} else {
			$(".locations h4").text(
				Object.keys(Object.assign({}, stateId, cityId)).sort().join(", ")
			);
		}
	});

	// Get the status of the API
	$.getJSON("http://0.0.0.0:5001/api/v1/status/", (data) => {
		// Update the styling based on the API status
		if (data.status === "OK") {
			$("div#api_status").addClass("available");
		} else {
			$("div#api_status").removeClass("available");
		}
	});

	// Fetch data about places using a POST request
	$.post({
		url: `${HOST}/api/v1/places_search`,
		data: JSON.stringify({}),
		headers: {
			"Content-Type": "application/json",
		},
		success: (data) => {
			// Append place information to the places section
			data.forEach((place) =>
				$("section.places").append(
					`<article>
			<div class="title_box">
			<h2>${place.name}</h2>
			<div class="price_by_night">$${place.price_by_night}</div>
			</div>
			<div class="information">
			<div class="max_guest">${place.max_guest} Guest${
						place.max_guest !== 1 ? "s" : ""
					}</div>
			<div class="number_rooms">${place.number_rooms} Bedroom${
						place.number_rooms !== 1 ? "s" : ""
					}</div>
			<div class="number_bathrooms">${place.number_bathrooms} Bathroom${
						place.number_bathrooms !== 1 ? "s" : ""
					}</div>
			</div> 
			<div class="description">
			${place.description}
			</div>
				</article>`
				)
			);
		},
		dataType: "json",
	});

	// Bind the searchPlace function to the click
	// event of the button in the filters section
	$(".filters button").bind("click", searchPlace);
	// Trigger the searchPlace function
	searchPlace();


	 // Function to fetch places based on selected filters
	 function searchPlace() {
		$.post({
		  url: `${HOST}/api/v1/places_search`,
		  data: JSON.stringify({
			amenities: Object.values(amenityId),
			states: Object.values(stateId),
			cities: Object.values(cityId),
		  }),
		  headers: {
			"Content-Type": "application/json",
		  },
		  success: (data) => {
			// Clear existing places and log IDs to console
			$("section.places").empty();
			data.forEach((d) => console.log(d.id));
			// Append place information to the places section
			data.forEach((place) => {
			  $("section.places").append(
				`<article>
				  <div class="title_box">
					<h2>${place.name}</h2>
					<div class="price_by_night">$${place.price_by_night}</div>
				  </div>
				  <div class="information">
					<div class="max_guest">${place.max_guest} Guest${
				  place.max_guest !== 1 ? "s" : ""
				}</div>
					  <div class="number_rooms">${place.number_rooms} Bedroom${
				  place.number_rooms !== 1 ? "s" : ""
				}</div>
					  <div class="number_bathrooms">${
						place.number_bathrooms
					  } Bathroom${place.number_bathrooms !== 1 ? "s" : ""}</div>
				  </div> 
				  <div class="description">
					${place.description}
				  </div>
				  <div class="reviews" data-place="${place.id}">
					<h2></h2>
					<ul></ul>
				  </div>
				</article>`
			  );
			  // Fetch reviews for each place
			  fetchReviews(place.id);
			});
		  },
		  dataType: "json",
		});
	  }
	  // Function to fetch reviews for a specific place
	  function fetchReviews(placeId) {
		$.getJSON(
		  `${HOST}/api/v1/places/${placeId}/reviews`,
		  (data) => {
			// Update the reviews section with review information
			$(`.reviews[data-place="${placeId}"] h2`)
			  .text("test")
			  .html(`${data.length} Reviews <span id="toggle_review">show</span>`);
			$(`.reviews[data-place="${placeId}"] h2 #toggle_review`).bind(
			  "click",
			  { placeId },
			  function (e) {
				const rev = $(`.reviews[data-place="${e.data.placeId}"] ul`);
				if (rev.css("display") === "none") {
				  rev.css("display", "block");
				  data.forEach((r) => {
					$.getJSON(
					  `${HOST}/api/v1/users/${r.user_id}`,
					  (u) =>
						$(".reviews ul").append(`
					  <li>
						<h3>From ${u.first_name + " " + u.last_name} the ${
						  r.created_at
						}</h3>
						<p>${r.text}</p>
					  </li>`),
					  "json"
					);
				  });
				} else {
				  rev.css("display", "none");
				}
			  }
			);
		  },
		  "json"
		);
	  }
});
