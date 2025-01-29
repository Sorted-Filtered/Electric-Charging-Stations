// Initialize the map
var map = L.map('map').setView([39.5, -98.35], 5); // Centered in the US

// Add Tile Layer (Base Map)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

var heatLayer; // Placeholder for the heatmap layer

// Function to load data from CSV
function loadCSVData() {
    Papa.parse('data/ev_charging_stations.csv', { // Updated path
        download: true,
        header: true,
        dynamicTyping: true,
        complete: function(results) {
            var data = results.data;
            populateStateDropdown(data);
            updateHeatmap(data);
        }
    });
}

// Populate the state dropdown dynamically
function populateStateDropdown(data) {
    var stateSelect = document.getElementById('stateSelect');
    var states = [...new Set(data.map(row => row.State))].sort(); // Get unique states

    states.forEach(state => {
        if (state) {
            var option = document.createElement('option');
            option.value = state;
            option.textContent = state;
            stateSelect.appendChild(option);
        }
    });

    stateSelect.addEventListener('change', function() {
        updateHeatmap(data, this.value);
    });
}

// Function to update the heatmap
function updateHeatmap(data, selectedState = '') {
    if (heatLayer) {
        map.removeLayer(heatLayer); // Remove previous heatmap
    }

    // Filter data based on the selected state
    var filteredData = selectedState ? data.filter(row => row.State === selectedState) : data;

    // Convert to heatmap format
    var heatData = filteredData.map(row => [row.Latitude, row.Longitude, 1]); // [lat, lon, intensity]

    // Add new heatmap layer
    heatLayer = L.heatLayer(heatData, { radius: 15, blur: 25, maxZoom: 10 }).addTo(map);
}

// Load data on page load
loadCSVData();
