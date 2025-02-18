// Step 1: CREATE THE BASE LAYERS
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// This function determines the color of the marker based on the depth of the earthquake.
function getColor(depth) {
  if (depth > 90) {
    return "#ea2c2c";
  } else if (depth > 70) {
    return "#ea822c";
  } else if (depth > 50) {
    return "#ee9c00";
  } else if (depth > 30) {
    return "#eecc00";
  } else if (depth > 10) {
    return "#d43300";
  } else {
    return "#98ee00";
  }

}


let queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';
d3.json(queryUrl).then(function (data) {
  console.log(data);

  // loop through earthquakes
  let markers = [];
  for (let i = 0; i < data.features.length; i++) {
    let row = data.features[i];
    let location = row.geometry.coordinates;
    if (location) {
      let latitude = location[1];
      let longitude = location[0];
      let depth = location[2];

      // create marker
      let marker = L.circleMarker([latitude, longitude], {
        fillOpacity: 0.75,
        color: "white",
        fillColor: getColor(depth),
        radius: 25
      }).bindPopup(`<h1>${row.properties.title}</h1>`);

      markers.push(marker);
    }

  }

let markerLayer = L.layerGroup(markers);  

  // Step 3: CREATE THE LAYER CONTROL
  let baseMaps = {
    Street: street,
    Topography: topo
  };

  let overlayMaps = {
    Earthquakes: markerLayer
  };


  // Step 4: INITIALIZE THE MAP
  let myMap = L.map("map", {
    center: [40.7, -94.5],
    zoom: 3,
    layers: [street, markerLayer]
  });

  // Step 5: Add the Layer Control, Legend, Annotations as needed
  L.control.layers(baseMaps, overlayMaps).addTo(myMap);

});