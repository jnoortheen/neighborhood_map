'use strict';

var ViewModel = function() {
    var self = this;
    // info window template
    var infoWindowHtmlTemplate = '<div class="infoWindow"><header>%title%</header><section>%content%</section><article><a href="%wikilink%" target="_blank">Wikipedia</a></article></div>';

    // to on/off neghborhood search
    self.showMarkersDiv = ko.observable(false);
    // bind or unbind google autocomplete functionality
    self.bindGoogleAutoComplete = function() {
        if (self.showMarkersDiv()) {
            // unbind google autocomplete
            autocompleteService.unbindAll();
            google.maps.event.clearInstanceListeners(inpElem);
            self.clearInpFld();
        } else {
            bindAutoComplete();
        }
    };

    // to on/off functionality to create map marker on click
    // load from saved preference if available
    self.enableMapClickMarker = ko.observable((!(localStorage.enableMapClickMarker) || (localStorage.enableMapClickMarker === 'true')));
    self.showMapClickSnackBarMsg = function() {
        var elem = document.getElementById("snackbar");
        elem.className = "show";
        elem.innerText = (self.enableMapClickMarker() ? "Enabled" : "Disabled") + " creation of marker on map click";
        setTimeout(function() { elem.className = elem.className.replace("show", ""); }, 3000);
        // save preference to localStorage
        localStorage.enableMapClickMarker = self.enableMapClickMarker();
    };

    // list of marker objects to show on the sidebar
    self.markers = ko.observableArray();

    // filter text to show only selected objects
    self.searchText = ko.observable("");

    // filter markers based on the text
    self.filteredMarkers = ko.computed(function() {
        if (self.searchText()) {
            var filter = self.searchText().toLowerCase();
            return ko.utils.arrayFilter(self.markers(), function(item) {
                if (item.locationName.toLowerCase().indexOf(filter) !== -1){
                    item.setVisible(true);
                  return true;  
                } 
                else {
                    item.setVisible(false);
                    return false;
                }
            })
        } else {
            return self.markers();
        }
    });

    // store place names to a set to avoid duplicate places
    self.placeIds = ko.computed(function() {
        var set = {};
        for (var idx = 0; idx < self.markers().length; idx++) {
            var place = self.markers()[idx].place;
            if (place) {
                set[place.place_id] = "";
            }
        }
        return set;
    });

    // add a marker to the observable
    self.addMarker = function(place) {
        // skip this if it is a duplicate
        if (place.place_id in self.placeIds()) {
            return;
        }

        // marker object init
        var marker = new google.maps.Marker({
            position: place.geometry.location,
            map: map
        });

        if (place.formatted_address) {
            marker.locationName = place.formatted_address;
        } else {
            marker.locationName = place.name;
        }
        marker.place = place;
        // fetch content from wikipedia
        marker.content = "NA";
        ajaxWiki(place.name, function(respObj) {
                marker.wiki = respObj;
                marker.content = infoWindowHtmlTemplate
                    .replace("%content%", respObj.content)
                    .replace("%title%", respObj.title)
                    .replace("%wikilink%", respObj.url);
            },
            function(respMsg) {
                snackbarAlert(respMsg);
            });
        marker.showInfo = function() {
            infoWindow.setContent(this.content);
            infoWindow.open(map, this);
        };
        marker.animatedInfo = function() {
            var that = this;
            that.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                that.setAnimation(null)
                that.showInfo();
            }, 1000);
        };
        self.markers.push(marker);
        google.maps.event.addListener(marker, 'click', marker.animatedInfo);
    };

    // remove a location marker on clicking the delete button
    self.removeMarker = function(marker) {
        self.markers.remove(marker);
        marker.setMap(null);
    };

    // zoom to the selected marker position
    self.gotoMarkerLocation = function(marker) {
        gotoPlace(marker.place);
        marker.animatedInfo();
    };

    // clear search input
    self.clearInpFld = function() {
        self.searchText("");
    };

    /**
     * save all places array to local storage whenever value changes
     */
    self.savePlaces = ko.computed(function() {
        if (self.markers().length === 0) return;
        var places = [];
        self.markers().forEach(function(marker) {
            places.push(marker.place);
        }, this);
        localStorage.setItem('places', ko.toJSON(places));
    });
};