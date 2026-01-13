
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
                // Make mapManager globally accessible
                window.mapManager = new MapManager();
                //map init and own position as marker
                window.mapManager.initMap(latitude, longitude);
                
                /* ********* Aufgabe 3 ************ */
                // Tags aus dem data-Attribut auslesen
                var mapDiv = document.getElementById("map");
                var tags = [];
                if (mapDiv && mapDiv.dataset.tags) {
                    try {
                        tags = JSON.parse(mapDiv.dataset.tags);
                    } catch (e) {
                        console.log("Fehler beim Parsen der Tags: " + e);
                    }
                }

                window.mapManager.updateMarkers(latitude, longitude, tags);

                /* ****************************** */
            
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

/* AUFGABE 4 */

/**
 * Helper function to update the Map and List
 * @param {Array} tagList 
 */

function updateView(tagList) {
    // 1. Liste aktualisieren
    var discoveryResults = document.getElementById("discoveryResults");
    if (discoveryResults) {
        discoveryResults.innerHTML = ""; // angezeigte Liste leeren

        tagList.forEach(function(tag) {     //fuer jedes Element im tagList-Array ein HTML-Listenelement hinzufuegen
            var li = document.createElement("li");
            li.innerHTML = tag.name + " (" + tag.latitude + ", " + tag.longitude + ") " + tag.hashtag;
            discoveryResults.appendChild(li);
        });
    }

    // 2. Karte aktualisieren
    var latInput = document.getElementById("latitude");     //Position auslesen
    var lonInput = document.getElementById("longitude");
    
    if (window.mapManager && latInput && lonInput) {        //Wenn Werte gegeben, mit diesen Karte akualisieren
        window.mapManager.updateMarkers(latInput.value, lonInput.value, tagList);
    }
}

/**
 * AJAX Handler for Tagging Form
 */
async function handleTagForm() {
    
    var lat = document.getElementById("latitude").value;       //Werte aus Tag Form auslesen
    var lon = document.getElementById("longitude").value;
    var name = document.getElementById("name").value;
    var hashtag = document.getElementById("hashtag").value;

    if (!lat || !lon || !name) return;     //Abbruch, wenn ein Wert fehlt 

    var geotag = {      //Werte auslesen und in geotag-Objekt einfuegen
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
        name: name,
        hashtag: hashtag
    };

    
    var response = await fetch("/api/geotags", { //fetch mit Request-Objekt mit neuem Goetag-> gibt response-Objekt zurueck
        method: "POST", 
        headers: {
            "Content-Type": "application/json"      //MIME-Type für JSON im HTTP-Header Content-Type, damit der Server den Inhalt erkennt.
        },
        body: JSON.stringify(geotag)
    });

    if (response.status === 201) {              // Wenn response-Objekt zurueckgegeben wurde
        var result = await response.json();     //in JS-Objekt umwandeln
        console.log("GeoTag added:", result);   //Ausgabe zur Kontrolle

        const nearbyGeoTagsRes = await fetch('/api/geotags?latitude='+lat+'&longitude='+lon,
            {                                   //mit fetch Elemente aus der Umgebung anfordern
            method: 'GET',                      
            headers: {"Accept":"application/json"} 
             }
        )

        if(nearbyGeoTagsRes.ok){                //wenn angeforderte Elemente erfolgreich zurueckgegeben wurden
            console.log("Got nearby Tags");
            const nearbyGeoTags = await nearbyGeoTagsRes.json();    //Diese in JS-Objekte umwandeln
            updateView(nearbyGeoTags);          //und diese in die uptadeView-Funktion von oben eingeben
        }        
    }
    else{
        console.error("Failed adding GeoTag", res.statusText());
    }
    
}

/**
 * AJAX Handler for Discovery Form
 */
async function handleDiscoveryForm() {

    var lat = document.getElementById("discovery-latitude").value;      //Werte aus Discovery Form auslesen
    var lon = document.getElementById("discovery-longitude").value;
    var searchterm = document.getElementById("searchterm") ? document.getElementById("searchterm").value : "";

   var res = await fetch('/api/geotags?latitude='+lat+'&longitude='+lon+'&searchterm='+searchterm,{
        method: "GET",                  //mit fetch und des ausgelesenen Werten die Geotags abfragen
        headers: {
            'Accept':'application/json'
        }
    });

    if(res.ok){                             //wenn erfolgreich
        const tags = await res.json();      //Response in JS-Objekt umwandeln
        console.log("Discoveryform submitted und fetch ok");
        console.log(tags);
        updateView(tags);   //Geotags aus dem Response in die Methode updateView eingeben 
    }
}

//trso1014
//function called after all  HTML contents were loaded
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();   

    // Event Listener
    var tagForm = document.getElementById("tag-form");
    var discoveryForm = document.getElementById("discoveryFilterForm"); 

     if(tagForm){
        tagForm.addEventListener("submit", async (event) => {
            console.log("In Ajax Post Methode");
            event.preventDefault();     //standardmaeßiges Absenden des Formulars verhindert
            handleTagForm();            //stattdessen wird Funktion mit fetch API aufgerufen
        });
    }

    if(discoveryForm){
        discoveryForm.addEventListener("submit", async (event) =>{
            console.log("In Ajax Discovery Form");
            event.preventDefault();     //standardmaeßiges Absenden des Formulars verhindert
            handleDiscoveryForm();      //stattdessen wird Funktion mit fetch API aufgerufen  
        });
    }
});
