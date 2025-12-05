// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
class InMemoryGeoTagStore{
    
    // TODO: ... your code here ...
    #geoTag_array = [];

    #geoTagExamples = GeoTagExamples.tagList;
    
    get taglist() { return this.#geoTag_array; }

    constructor(){
        this.#geoTag_array = [];

        this.loadExamples();
    }

    loadExamples(){
        for (var tag in this.#geoTagExamples) {
            
            this.addGeoTag(new GeoTag(this.#geoTagExamples[tag][0], this.#geoTagExamples[tag][1], this.#geoTagExamples[tag][2], this.#geoTagExamples[tag][3]));
        }
    }



    addGeoTag(geoTag){
        this.#geoTag_array.push(geoTag);

    }

    removeGeoTagn(tagName){
       
        this.#geoTag_array.forEach(element => {
            if(element != null){
                if(element.name==tagName){
                    this.#geoTag_array.splice(this.#geoTag_array.findIndex(element),1);
                }
            }
        });            
    }

    getNearbyGeoTags(latitude, longitude,radius=1){
        return this.#geoTag_array.filter(tag => {
            const distance = this.haversineDistance(
                latitude, longitude, tag.latitude, tag.longitude
            )
            return distance <= radius;
        })
    }

    searchNearbyGeoTags(latitude,longitude,radius,keyword){
        return this.#geoTag_array.filter(geotag => {

            console.log(geotag.name);

            const distance = this.haversineDistance(latitude, longitude, geotag.latitude, geotag.longitude);
            const nameMatch = geotag.name.toLowerCase().includes(keyword.toLowerCase());
            const hashtagMatch = geotag.hashtag.toLowerCase().includes(keyword.toLowerCase());
            console.log("namematch: "+nameMatch);
            console.log("hashtag: "+hashtagMatch);
            return distance <= radius && (nameMatch || hashtagMatch);
        });
    }


    haversineDistance(lat1, lon1, lat2, lon2, radius = 6371) {
        const toRadians = (degree) => degree * (Math.PI / 180);
    
        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);
    
        const lat1Rad = toRadians(lat1);
        const lat2Rad = toRadians(lat2);
    
        const a = Math.sin(dLat / 2) ** 2 +
                  Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2;
    
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        console.log("c: "+ c + "    radius: " + radius+ "    Erg: " + radius*c );
        return radius * c; // Distanz in Kilometern
    }



};

module.exports = InMemoryGeoTagStore
