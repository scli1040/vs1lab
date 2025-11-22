// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

/**
  * A class to help using the HTML5 Geolocation API.
  */
class LocationHelper {
    // Location values for latitude and longitude are private properties to protect them from changes.
    #latitude = '';

    /**
     * Getter method allows read access to privat location property.
     */
    get latitude() {
        return this.#latitude;
    }

    #longitude = '';

    get longitude() {
        return this.#longitude;
    }

   /**
    * Create LocationHelper instance if coordinates are known.
    * @param {string} latitude 
    * @param {string} longitude 
    */
   constructor(latitude, longitude) {
       this.#latitude = (parseFloat(latitude)).toFixed(5);
       this.#longitude = (parseFloat(longitude)).toFixed(5);
   }

    /**
     * The 'findLocation' method requests the current location details through the geolocation API.
     * It is a static method that should be used to obtain an instance of LocationHelper.
     * Throws an exception if the geolocation API is not available.
     * @param {*} callback a function that will be called with a LocationHelper instance as parameter, that has the current location details
     */
    static findLocation(callback) {
        const geoLocationApi = navigator.geolocation;

        if (!geoLocationApi) {
            throw new Error("The GeoLocation API is unavailable.");
        }

        // Call to the HTML5 geolocation API.
        // Takes a first callback function as argument that is called in case of success.
        // Second callback is optional for handling errors.
        // These callbacks are given as arrow function expressions.
        geoLocationApi.getCurrentPosition((location) => {
            // Create and initialize LocationHelper object.
            let helper = new LocationHelper(location.coords.latitude, location.coords.longitude);
            // Pass the locationHelper object to the callback.
            callback(helper);
        }, (error) => {
           alert(error.message)
        });
    }
}

/**
 * A class to help using the Leaflet map service.
 */
class MapManager {

    #map
    #markers

    /**
    * Initialize a Leaflet map
    * @param {number} latitude The map center latitude
    * @param {number} longitude The map center longitude
    * @param {number} zoom The map zoom, defaults to 18
    */
    initMap(latitude, longitude, zoom = 18) {
        // set up dynamic Leaflet map
        this.#map = L.map('map').setView([latitude, longitude], zoom);
        var mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
        L.tileLayer(
            'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; ' + mapLink + ' Contributors'}).addTo(this.#map);
        this.#markers = L.layerGroup().addTo(this.#map);
    }

    /**
    * Update the Markers of a Leaflet map
    * @param {number} latitude The map center latitude
    * @param {number} longitude The map center longitude
    * @param {{latitude, longitude, name}[]} tags The map tags, defaults to just the current location
    */
    updateMarkers(latitude, longitude, tags = []) {
        // delete all markers
        this.#markers.clearLayers();
        L.marker([latitude, longitude])
            .bindPopup("Your Location")
            .addTo(this.#markers);
        for (const tag of tags) {
            L.marker([tag.latitude,tag.longitude])
                .bindPopup(tag.name)
                .addTo(this.#markers);  
        }
    }
}

/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
// ... your code here ...

function updateLocation(){
     try {
    
    LocationHelper.findLocation((helper) => {
        var latitude = helper.latitude;
        var longitude = helper.longitude;

        //visible inputs
        var formInputLatitude = document.getElementById("latitude");
        var formInputLongitude = document.getElementById("longitude");

        if (formInputLatitude) {
            formInputLatitude.setAttribute("value", latitude);
        }

        if (formInputLongitude) {
            formInputLongitude.setAttribute("value", longitude);
        }

        //hidden inputs
        var discLatInput = document.getElementById("discovery-latitude");
        var discLonInput = document.getElementById("discovery-longitude");

        if (discLatInput) {
            discLatInput.setAttribute("value", latitude);
        }
        if (discLonInput) {
            discLonInput.setAttribute("value", longitude);
        }  
       
        //Aufgabe 2
        var map = new MapManager();

        map.initMap(latitude, longitude);
        map.updateMarkers(latitude, longitude);
        
    });
    
    } catch (err) {
        console.log("Fehler beim Bestimmen der location");
    }
/*
    //Aufgabe 2
    var latitude = document.getElementById("latitude").getAttribute("value");
    var longitude = document.getElementById("longitude").getAttribute("value");
    var map = new MapManager();

    map.initMap(latitude, longitude);
    map.updateMarkers(latitude, longitude);
    */
   
     /* parent */
    var image       = document.getElementById("map");
    /* children */
    var previousImg = image.getElementsByTagName("img")[0];
    var span        = image.getElementsByTagName("span")[0];

    if (previousImg) {
        previousImg.remove();
    }
    
    if (span) {
        span.remove();
    }

}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});