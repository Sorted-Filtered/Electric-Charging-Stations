let myMap = L.map("map", {
    center: [38.7946, -106.5348],
    zoom: 5
  });
  
// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

let mapBounds = [];

// Establish layers.
let layers = {
  mapMarkers: new L.markerClusterGroup(),
  heatLayer: new L.LayerGroup()
}
// Adding overlay layers
let overlays = {
  "Station Markers": layers.mapMarkers,
  "Station Heatmap": layers.heatLayer
}

// Adding control to map
L.control.layers(null, overlays).addTo(myMap);

function createMap(state) {
  mapBounds = [];
  layers.mapMarkers.clearLayers();
  layers.heatLayer.clearLayers();

  // Fetch the api endpoint data
  let url = `http://127.0.0.1:5000/stations/${state}`;

  // Call the API, <response> is the api json data
  d3.json(url).then(function(response) {

    console.log(response);

    // Call updateSummary to generate state statistics
    updateSummary(response);

    // Create the markers for each station
    let marker_limit = response.length;
    let heatArray = [];
  
    // Loop through the features
    for (let i = 0; i < marker_limit; i++) {

      let feature = response[i];

      // Add Lat/Long to heat array
      heatArray.push([feature.Latitude, feature.Longitude])

      // Generate markers, add them to marker layer, and change map bounds
      let marker = L.marker([feature.Latitude, feature.Longitude])
      .bindPopup(`<h5>Location: ${feature["Station Name"]} <br>Address: ${feature["Street Address"]} <br>Open Times: ${feature["Access Days Time"]} <br>Charger Types: ${feature["EV Connector Types"]} 
        <br>DC Chargers: ${feature["EV DC Fast Count"]} <br>Level 2 Chargers: ${feature["EV Level2 EVSE Num"]}
        <br>Level 1 Chargers: ${feature["EV Level1 EVSE Num"]}`
      );
      marker.addTo(layers.mapMarkers);
      mapBounds.push([feature.Latitude, feature.Longitude]);
    }

    // Add marker layer to map and change bounds of map for selected state.
    myMap.fitBounds(mapBounds);
    layers.mapMarkers.addTo(myMap);
    console.log(heatArray);

    // Use heatArray to create heatmap layer
    L.heatLayer(heatArray, {
      radius: 15,
      blur: 25,
      maxZoom: 10
    }).addTo(layers.heatLayer);

    // Plot the data
    plotData(response);
  });
}

// Create the plots
function plotData(response) {

  let sortedData = response.sort((a, b) => b['Open Date'] - a['Open Date']);

  dates = [];
  sums = [];
  activeDate = 'none';
  activeSum = 0;

  let featureLength = sortedData.length;

  // Loop through the features
  for (let i = 0; i < featureLength; i++) {
    let feature = sortedData[i];

    if (i == (featureLength - 1)) {
      dates.push(activeDate);
      sums.push(activeSum);
    } else if (i == 0) {
      activeDate = feature['Open Date'];
      activeSum = 1;
    } else if (feature['Open Date'] != activeDate) {
      dates.push(activeDate);
      sums.push(activeSum);
      activeDate = feature['Open Date'];
      activeSum = 1;
    } else {
      activeSum = activeSum + 1;
    }
  }

  // Trace1
  let trace1 = {
    x: dates,
    y: sums,
    type: "bar"
  };

  // Data array
  let data = [trace1];

  // Apply a title to the layout
  let layout = {
    title: "Electric Charger Openings by Date"
  };

  // Render the plot to the div tag with id "plot"
  Plotly.newPlot("plot", data, layout);
}


// Fill summary element with analysis
function updateSummary(response) {
    let connectorSummary = {
      teslaCon: 0,
      j1772Con: 0,
      chademoCon: 0,
      j1772comboCon: 0,
      totalStations: 0,
      total2025: 0,
      total2020: 0,
      total2015: 0,
      total2010: 0,
      totalBefore2010: 0
      }

    // Loop though state data to populate summary element
    for (let i = 0; i < response.length; i++) {
      let connectors = response[i]["EV Connector Types"];
      let openDate = new Date(response[i]["Open Date"]);
      let openYear = openDate.getFullYear();

      // Add to total stations and connector types by connector
      connectorSummary.totalStations += 1
      if (connectors) {
        if (connectors.includes("TESLA")) {
          connectorSummary.teslaCon += 1
        }
        if (connectors.includes("J1772")) {
          connectorSummary.j1772Con += 1
        }
        if (connectors.includes("CHADEMO")) {
          connectorSummary.chademoCon += 1
        }
        if (connectors.includes("J1772COMBO")) {
          connectorSummary.j1772comboCon += 1
        }
      } else {
        console.log("No common connectors available at " + response[i]["Station Name"] + "  " + response[i]["EV Connector Types"])
      }

      // Add to stations built by year
      if (openDate) {
        if (openYear <= 2009) {
          connectorSummary.totalBefore2010 += 1
        }
        if (openYear <= 2014 && openYear >= 2010) {
          connectorSummary.total2010 += 1
        }
        if (openYear <= 2019 && openYear >= 2015) {
          connectorSummary.total2015 += 1
        }
        if (openYear <= 2024 && openYear >= 2020) {
          connectorSummary.total2020 += 1
        }
        if (openYear === 2025) {
          connectorSummary.total2025 += 1
        }
      } else {
        console.log("Station not opened before 2026! " + openDate)
      }
    }

    // Add totals to html element
    d3.select("#total-station").text("Total Number of Stations: " + connectorSummary.totalStations);
    d3.select("#total-2025").text("Total Built This Year(2025): " + connectorSummary.total2025);
    d3.select("#total-2020").text("Total Built in 2020-2024: " + connectorSummary.total2020);
    d3.select("#total-2015").text("Total Built in 2015-2020: " + connectorSummary.total2015);
    d3.select("#total-2010").text("Total Built in 2010-2015: " + connectorSummary.total2010);
    d3.select("#total-before-2010").text("Total Built Before 2010: " + connectorSummary.totalBefore2010);
    d3.select("#total-tesla").text("Total Tesla: " + connectorSummary.teslaCon);
    d3.select("#total-J1772").text("Total J1772: " + connectorSummary.j1772Con);
    d3.select("#total-CHADEMO").text("Total CHADEMO: " + connectorSummary.chademoCon);
    d3.select("#total-J1772COMBO").text("Total J1772COMBO: " + connectorSummary.j1772comboCon);
    pieChartSummary(connectorSummary)
}

// Function to create pie chart based on connector type totals
function pieChartSummary(connectorSummary) {
  console.log(connectorSummary);
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

