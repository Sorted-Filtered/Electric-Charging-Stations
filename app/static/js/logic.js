let myMap = L.map("map", {
    center: [38.7946, -106.5348],
    zoom: 5
  });
  
  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
  // Fetch the api endpoint data
  let url = "http://127.0.0.1:5000/stations/MN";
  
  d3.json(url).then(function(response) {

    console.log(response);
  
    let marker_limit = response.length;

    // Loop through the features
    for (let i = 0; i < marker_limit; i++) {

      let feature = response[i];
      L.marker([feature.Latitude, feature.Longitude]).addTo(myMap);
  
    }
  
  });