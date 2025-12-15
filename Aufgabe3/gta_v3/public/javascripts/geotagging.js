// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");



/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
// ... your code here ...

function updateLocation(){
    /* Teilaufgabe 1 */
    try {
        LocationHelper.findLocation((helper) => {
            var latitude = helper.latitude;
            var longitude = helper.longitude;

            //visible inputs
            var inputLatitude = document.getElementById("latitude");
            var inputLongitude = document.getElementById("longitude");

            if (inputLatitude) {
                inputLatitude.value = latitude;
            }
            if (inputLongitude) {
                inputLongitude.value = longitude;
            }

            //hidden inputs
            var discLatInput = document.getElementById("discovery-latitude");
            var discLonInput = document.getElementById("discovery-longitude");

            if (discLatInput) {
                discLatInput.value = latitude;
            }
            if (discLonInput) {
                discLonInput.value = longitude;
            }    

            console.log("Location aktualisiert: " + latitude + ", " + longitude); //Testnachricht


            /* Teilaufgabe 2 */
            try {
                //trso1014
                //const -> var stays local and can not accept new value to prevent bugs
                const mapManager = new MapManager();
                //map init and own position as marker
                mapManager.initMap(latitude, longitude);
                mapManager.updateMarkers(latitude, longitude);
            
                //wiph1019
                // ruft über DOM image, das preset Bild, p und span auf
                var image = document.getElementById("map");
                var presetImage = image.getElementsByTagName("img")[0];
                var p = image.getElementsByTagName("p")[0];
                var span = image.getElementsByTagName("span")[0];

                // Vorheriges Bild + vorherige Werte werden entfernt
                presetImage.remove();
                image.removeChild(span); 
                if (p) {image.removeChild(p);} // var p existiert bei uns nicht, deswegen if falls es doch vorkommt

                console.log("Map aktualisiert"); //Testnachricht
            } catch (error) {
                console.log("Fehler beim Erstellen der Map");
            }
    });
    } catch (error) {
            console.log("Fehler beim Bestimmen der location");
        }

}


//trso1014
//function called after all  HTML contents were loaded
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();   
});