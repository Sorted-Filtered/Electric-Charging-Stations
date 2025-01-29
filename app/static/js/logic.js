let myMap = L.map("map", {
    center: [38.7946, -106.5348],
    zoom: 5
  });
  
// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

let mapMarkers = [];

function createMap(state) {
  for(var i = 0; i < mapMarkers.length; i++){
    myMap.removeLayer(mapMarkers[i]);
  }

  // Fetch the api endpoint data
  let url = `http://127.0.0.1:5000/stations/${state}`;

  d3.json(url).then(function(response) {

    console.log(response);

    let marker_limit = response.length;

    // Loop through the features
    for (let i = 0; i < marker_limit; i++) {

      let feature = response[i];
      let marker = L.marker([feature.Latitude, feature.Longitude]);
      marker.addTo(myMap);
      mapMarkers.push(marker);
    }

  });
}

// Preload the map data with MN data
createMap('MN');

// This function is called when a dropdown menu item is selected
function updateMap() {

  // Use D3 to select the dropdown menu
  let dropdownMenu = d3.select("#stateSelect");

  // Assign the value of the dropdown menu option to a variable
  let state = dropdownMenu.property("value");
  createMap(state);
}

// Call updateMap() when a change takes place to the DOM
d3.selectAll("#stateSelect").on("change", updateMap);