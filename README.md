# Electric-Charging-Stations
### Project 3
[Initial Project Proposal](https://docs.google.com/document/d/e/2PACX-1vRp7swMp49pTJ4GqwTmX3-tOEq8j-hNejuS-SIiaXR6az_O9g_TZT3VCgAf_T4pLdS5fBHd8ygQumSz/pub)

[U.S. Department of Energy website where data was downloaded from](https://afdc.energy.gov/fuels/electricity-locations#/find/nearest?country=US&fuel=ELEC&ev_levels=all)

## Project Description
This application provides a map-based visualization of EV charging stations across the U.S. Users can view station details, including connector types, addresses, and times the chargers are open (if available) through marker popups, along with heatmaps to better visualize station density. The application also shows analytical plots for station openings over time, as well as summaries of connectors and when stations were created in each selected state.

## Execution
Before running the app, ensure you have the following installed:

-Python 3.x

-Flask (pip install flask)

-Flask-CORS (pip install flask-cors)

-PyMongo (pip install pymongo)

-MongoDB (running on port 27017)


1. Once installed, run the file in the data_collection folder named "pymongo_import.ipynb". This will populate the needed data from the "raw_data.csv" file into our MongoDB database called "electric_charging", with a collection named "stations".
2. Run the API script (api_endpoint.py) found in the folder named "api" through a terminal. Once running, you will see that flask is running on http://127.0.0.1:5000. Available API endpoints include:

       / : Lists available API routes.

       /stations/<state> : Fetches all stations for a specific U.S. state. Replace <state> with state abbreviation (MN for Minnesota)

4. Run the app using a local web server, or open the HTML directly.

        Using python HTTP server: run "python -m http.server" in terminal in application's directory, this will generate the webpage on http://localhost:8000.
   
        Opening file directly: Open HTML file in web browser, ensure that the API is running correctly to populate data onto the maps/plots/summary. Depending on security settings, some features might not work properly without a web server.

## Features
Map Visualization:

-Displays EV charging station locations with markers and heatmaps.

-Interactive popups provide station details, including addresses, available times, and charger types.

Analytical Plots:

-A bar chart visualizes the number of stations opened over time in the selected state.

-A pie chart visualizes the ratio of connectors available in the selected state. 

Real-Time Updates:

-Dropdown menu allows users to select a state and update the map dynamically. 

Javascript plugins used include d3, highchart, and leaflet. Python modules used include PyMongo, Flask, Flask-CORS, datetime, pprint, and the csv module. 

## Contributors
This project was done jointly by William Plaisance, Mohamoud Jama, Van Tran, Chandara In, and Lance Peterson. 

## License
GPL-3.0 License
