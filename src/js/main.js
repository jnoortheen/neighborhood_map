'use strict';
var vm; // viewmodel
var map;
var infoWindow;
var placeService;
var autocompleteService;
var inpElem = document.getElementById('searchInput');
// the search term will be appended to the end
var wikiQryUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&limit=1&format=json&origin=*&search=";

/**
 * bind google maps autocomplete service to variable
 */
var bindAutoComplete = function() {
    autocompleteService = new google.maps.places.Autocomplete(inpElem);
    autocompleteService.bindTo('bounds', map);
    autocompleteService.addListener('place_changed', addMarkerFromSearch);
};

/**
 * alert the user of some failed events in the background using snackbar
 */
var snackbarAlert = function(msg) {
    var elem = document.getElementById("snackbar");
    elem.className = "showAlert";
    elem.innerText = msg;
    setTimeout(function() { elem.className = elem.className.replace("showAlert", ""); }, 3000);
};

/**
 * init google maps api variables.
 * called after loading map by the script tag
 */
var initMap = function() {
    // map elements
    var mapdivElem = document.getElementById('mapdiv');

    // place request parameters
    var placeReq = {
        types: ['neighborhood', 'regions', 'cities']
    };

    // coordinate of Chennai, India.
    var location = new google.maps.LatLng(13.0827, 80.2707);

    // map initialisation
    map = new google.maps.Map(mapdivElem, {
        center: location,
        zoom: 12,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
            position: google.maps.ControlPosition.LEFT_BOTTOM
        }
    });

    // listens for map clicks and creats a marker on that place
    map.addListener('click', function(event) {
        if (!(vm.enableMapClickMarker())) {
            return;
        }
        placeReq.location = event.latLng;
        placeService.nearbySearch(placeReq, addMarkerByClickCallback);
    });

    // infowindow
    infoWindow = new google.maps.InfoWindow();

    // init place services
    placeService = new google.maps.places.PlacesService(map);
    placeReq.rankBy = google.maps.places.RankBy.DISTANCE;

    // init autocompleteService
    bindAutoComplete();

    // create all markers retrieved from local storage else load default locations
    var places;
    if (localStorage.places) {
        places = ko.utils.parseJson(localStorage.getItem('places'));
    } else {
        places = loadDefLocs();
    }

    places.forEach(function(place) {
        vm.addMarker(place);
    }, this);
};

// function to create marker on the map fetching place from the server and handle possible errors
var addMarkerByClickCallback = function(results, status) {
    if (status !== google.maps.places.PlacesServiceStatus.OK) {
        snackbarAlert("Failed to get place details.");
        return;
    }
    if (results.length === 0) {
        snackbarAlert("no neighborhood found at the selected location");
        return;
    }
    var place = results[0];
    if (gotoPlace(place)) {
        // add a marker to the best matching place
        vm.addMarker(results[0]);
        return;
    }
};

// function to add marker when a place is chosen from the search
var addMarkerFromSearch = function() {
    var place = autocompleteService.getPlace();
    if (gotoPlace(place)) {
        // if the geometry is valid then add a marker to the map
        vm.addMarker(place);
    }
};

/**
 *  if place has valid geometry then return true and zoom to the place 
 */
var gotoPlace = function(place) {
    if (!place.geometry) {
        window.alert("Autocomplete's returned place contains no geometry");
        return false;
    }

    if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
    } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
    }
    return true;
};

// used for by toggle methods
ko.bindingHandlers.toggleClick = {
    init: function(element, valueAccessor) {
        var value = valueAccessor();
        ko.utils.registerEventHandler(element, "click", function() {
            value(!value());
        });
    }
};

// apply vm
vm = new ViewModel();
ko.applyBindings(vm);