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

setRandomHeaderImage();

// SETUP VARIABLES
var searchCircleRadius = 1000;
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

// GET DATA
loadMarkers();

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
  color: "green",
  fillColor: "green",
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

// SETUP IMAGE OVERLAY
var imageOverlayPosition = [
  [47.531042, 21.636004],
  [47.530892, 21.636294],
];
var imageOverlayUrl = "pics/macskavezo.jfif";
var imageOverlayAltText = "Coffee shop with rescued cats";
var imageOverlay = L.imageOverlay(imageOverlayUrl, imageOverlayPosition, {
  opacity: 0.8,
  alt: imageOverlayAltText,
}).addTo(map);

var imageOverlayButton = document.getElementById("showImageOverlayButton");

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
  searchCircle.setRadius(searchCircleRadius);
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
    searchMarkers();
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
  var typeString = "";
  if (dogRadio.checked) {
    newMarker.setIcon(dogIcon);
    dogMarkers.addLayer(newMarker);
    typeString = "Dog";
  } else if (catRadio.checked) {
    newMarker.setIcon(catIcon);
    catMarkers.addLayer(newMarker);
    typeString = "Cat";
  } else {
    alert("Error: no type radio button checked!");
  }

  // handle age
  var selectedAge = $("#ageSelect").val();

  // handle description
  var description = document.getElementById("descrInput").value;

  newMarker.bindPopup(getPopUpMessage(typeString, selectedAge, description), {
    autoClose: false,
  });

  saveMarkers();
}

function getPopUpMessage(typeString, selectedAge, description) {
  return (
    "<p><b>Type: </b>" +
    typeString +
    "</p>" +
    "<p><b>Age: </b>" +
    selectedAge +
    "</p>" +
    '<p style="word-wrap: break-word"><b>Description: </b>' +
    description +
    "</p>"
  );
}

function saveMarkers() {
  saveMarkersByLayer(catMarkers, "cats");
  saveMarkersByLayer(dogMarkers, "dogs");
}

function saveMarkersByLayer(markerLayerGroup, apiEnd) {
  var geoJSONData = { type: "FeatureCollection", features: [] };
  markerLayerGroup.eachLayer((marker) => {
    var markerGeoJSON = marker.toGeoJSON();

    markerGeoJSON.geometry.coordinates = marker.getLatLng();
    markerGeoJSON.properties.popupContent = marker.getPopup().getContent();
    geoJSONData.features.push(markerGeoJSON);
  });

  fetch("http://localhost:3000/api/" + apiEnd, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(geoJSONData),
    credentials: "same-origin",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      console.log(apiEnd + " data sent successfully!");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

async function loadMarkers() {
  await loadMarkersByLayer(catMarkers, "cats", catIcon);
  await loadMarkersByLayer(dogMarkers, "dogs", dogIcon);
}

async function loadMarkersByLayer(markerLayerGroup, apiEnd, correctIcon) {
  fetch("http://localhost:3000/api/" + apiEnd, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) =>
      data.features.forEach((feature) => {
        const coordinates = feature.geometry.coordinates;
        const popupContent = feature.properties.popupContent;

        var marker = L.marker(coordinates, { icon: correctIcon }).bindPopup(
          popupContent.toString(),
          { autoClose: false }
        );
        markerLayerGroup.addLayer(marker);
      })
    )
    .then((response) => {
      console.log(apiEnd + " data loaded successfully!");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function setRandomHeaderImage() {
  var headerImage = document.getElementById("header-img");
  if (Math.random() < 0.5) {
    headerImage.src = "pics/cat.png";
  } else {
    headerImage.src = "pics/dog.png";
  }
}

function searchMarkers() {
  var foundCount = 0;
  if (map.hasLayer(catMarkers)) {
    foundCount = foundCount + countAndOpenPopupOnMarkers(catMarkers);
  }
  if (map.hasLayer(dogMarkers)) {
    foundCount = foundCount + countAndOpenPopupOnMarkers(dogMarkers);
  }

  if (foundCount === 0) {
    alert("Didn't find any lost pet in this area!");
  }
}

function countAndOpenPopupOnMarkers(markerLayerGroup) {
  var foundCount = 0;
  markerLayerGroup.eachLayer((marker) => {
    var distace = interactiveMarker.getLatLng().distanceTo(marker.getLatLng());
    if (distace < searchCircleRadius) {
      foundCount++;
      marker.openPopup();
    } else {
      marker.closePopup();
    }
  });
  return foundCount;
}

function showImageOverlay() {
  map.setView([47.530968, 21.636144], 20);
}

// BINDINGS
map.on("click", onMapClick);
interactiveMarker.on("moveend", onMarkerMoveEnd);
searchCircleRadiusScale.oninput = changeSearchCircleSize;
searchButton.onclick = searchButtonFunc;
addButton.onclick = addButtonFunc;
imageOverlayButton.onclick = showImageOverlay;
saveButton.onclick = saveButtonFunc;
modal.hide = modalClosed;
