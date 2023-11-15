var mbAttr =
  'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
var mbUrl =
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw";
var esriAerialUrl =
  "https://server.arcgisonline.com/ArcGIS/rest/services" +
  "/World_Imagery/MapServer/tile/{z}/{y}/{x}";
var esriAerialAttrib =
  "Tiles © Esri — Source: Esri, i-cubed, " +
  "USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the" +
  " GIS User Community";

// BASEMAPS
var osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap",
});
var streets = L.tileLayer(mbUrl, {
  id: "mapbox/streets-v11",
  tileSize: 512,
  zoomOffset: -1,
  attribution: mbAttr,
});
var satellite = new L.TileLayer(esriAerialUrl, {
  maxZoom: 18,
  attribution: esriAerialAttrib,
});

// SETUP VARIABLES
var searchCircleRadius = 1000;
var modalBody = document.getElementById("modalBody");

// SETUP MARKER GROUPS
var catMarkers = L.layerGroup();
var dogMarkers = L.layerGroup();

// SETUP MAP
var map = L.map("map", {
  center: [47.5534, 21.6236],
  zoom: 10,
  layers: [osm, catMarkers, dogMarkers],
});

var baseMaps = {
  OpenStreetMap: osm,
  "Mapbox Streets": streets,
  Satelite: satellite,
};
var overlayMaps = { "Macska jelölők": catMarkers, "Kutya jelölők": dogMarkers };

var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);

// ICONS
var BaseIcon = L.Icon.extend({
  options: {
    iconSize: [50, 60],
    iconAnchor: [24, 65],
    popupAnchor: [2, -60],
  },
});
var defaultIcon = new BaseIcon({ iconUrl: "pics/down-arrow.png" });
var catIcon = new BaseIcon({ iconUrl: "pics/cat.png" });
var dogIcon = new BaseIcon({ iconUrl: "pics/dog.png" });
var questionIcon = new BaseIcon({ iconUrl: "pics/question-mark.png" });

// INTERACTIVE MARKER
var interactiveMarker = L.marker([47.5534, 21.6236], {
  draggable: "true",
  icon: defaultIcon,
}).addTo(map);
interactiveMarker
  .bindPopup("This is your interactive marker that follows your cursor!")
  .openPopup();

// SETUP SEARCH CIRCLE
var searchCircle = L.circle(interactiveMarker.getLatLng(), {
  color: "red",
  fillColor: "#f03",
  fillOpacity: 0.5,
  radius: searchCircleRadius,
}).addTo(map);

var searchCircleRadiusScale = document.getElementById(
  "searchCircleRadiusScale"
);
var searchButton = document.getElementById("searchButton");
var searchModal = document.getElementById("searchModal");

// FUNCTIONS
function onMapClick(e) {
  var position = e.latlng;

  interactiveMarker
    .setLatLng(position)
    .setIcon(questionIcon)
    .getPopup()
    .setContent("You clicked the map at " + e.latlng.toString())
    .openOn(map);

  searchCircle.setLatLng(position);
}

function onMarkerMoveEnd(e) {
  var position = interactiveMarker.getLatLng();

  interactiveMarker
    .setIcon(defaultIcon)
    .getPopup()
    .setContent("You dragged the marker to " + position.toString())
    .openOn(map);

  searchCircle.setLatLng(position);
}

function changeSearchCircleSize() {
  searchCircleRadius = searchCircleRadiusScale.value;
  searchCircle.setRadius(searchCircleRadius / 2);
}

function searchButtonClick() {
  searchModal.classList.remove("hidden");
}

// BINDINGS
map.on("click", onMapClick);
interactiveMarker.on("moveend", onMarkerMoveEnd);
searchCircleRadiusScale.oninput = changeSearchCircleSize;
searchButton.onclick = searchButtonClick;