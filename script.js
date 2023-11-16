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
var searchCircleRadius = 500;
var activeMethod = "";
const addMethod = "Add";
const searchMethod = "Search";

// SETUP MODAL
var modal = document.getElementById("modal");
var modalBody = document.getElementById("modalBody");
var saveButton = document.getElementById("saveButton");
var modalLabel = document.getElementById("modalLabel");

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
    iconAnchor: [24, 60],
    popupAnchor: [2, -55],
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

// SETUP SEARCH
var searchCircle = L.circle(interactiveMarker.getLatLng(), {
  color: "red",
  fillColor: "#f03",
  opacity: 0,
  fillOpacity: 0,
  radius: searchCircleRadius,
}).addTo(map);

var searchCircleRadiusScale = document.getElementById(
  "searchCircleRadiusScale"
);
var searchButton = document.getElementById("searchButton");
var searchModal = document.getElementById("searchModal");

// SETUP ADD
var addModal = document.getElementById("addModal");
var addButton = document.getElementById("addButton");

// FUNCTIONS
function onMapClick(e) {
  var position = e.latlng;

  interactiveMarker.setLatLng(position);
  // .getPopup()
  // .setContent("You clicked the map at " + e.latlng.toString())
  // .openOn(map);

  searchCircle.setLatLng(position);
}

function onMarkerMoveEnd(e) {
  var position = interactiveMarker.getLatLng();

  // interactiveMarker;
  // .getPopup()
  // .setContent("You dragged the marker to " + position.toString())
  // .openOn(map);

  searchCircle.setLatLng(position);
}

function changeSearchCircleSize() {
  searchCircleRadius = searchCircleRadiusScale.value;
  searchCircle.setRadius(searchCircleRadius / 2);
}

function searchButtonFunc() {
  addModal.classList.add("hidden");
  searchModal.classList.remove("hidden");
  modalLabel.innerHTML = "Search in the area";

  saveButton.innerText = searchMethod;
  activeMethod = searchMethod;
  showSearchCircle();
}

function addButtonFunc() {
  hideSearchCircle();
  searchModal.classList.add("hidden");
  addModal.classList.remove("hidden");
  modalLabel.innerHTML = "Add marker to the map";

  saveButton.innerText = addMethod;
  activeMethod = addMethod;
}

function saveButtonFunc() {
  if (addMethod === activeMethod) {
    addMarker();
  } else if (searchMethod === activeMethod) {
    alert("searching");
  } else {
    alert("Error: no active method!");
  }

  $("#modal").modal("hide");
}

function modalClosed(e) {
  var buttonId = $(document.activeElement).attr("id");
  if (buttonId === "closeButton") {
    hideSearchCircle();
  }
}

function showSearchCircle() {
  searchCircle.setStyle({
    opacity: 1,
    fillOpacity: 0.5,
  });
  interactiveMarker.setIcon(questionIcon);
}

function hideSearchCircle() {
  searchCircle.setStyle({
    opacity: 0,
    fillOpacity: 0,
  });
  interactiveMarker.setIcon(defaultIcon);
  activeMethod = "";
}

function addMarker() {
  const newMarker = L.marker(interactiveMarker.getLatLng());

  // handle type
  var catRadio = document.getElementById("catRadio");
  var dogRadio = document.getElementById("dogRadio");
  if (dogRadio.checked) {
    newMarker.setIcon(dogIcon);
    dogMarkers.addLayer(newMarker);
  } else if (catRadio.checked) {
    newMarker.setIcon(catIcon);
    catMarkers.addLayer(newMarker);
  } else {
    alert("Error: no type radio button checked!");
  }

  // handle age
  var selectedAge = $("#ageSelect").val();
  alert(selectedAge);
}

// BINDINGS
map.on("click", onMapClick);
interactiveMarker.on("moveend", onMarkerMoveEnd);
searchCircleRadiusScale.oninput = changeSearchCircleSize;
searchButton.onclick = searchButtonFunc;
addButton.onclick = addButtonFunc;
saveButton.onclick = saveButtonFunc;
modal.hide = modalClosed;
