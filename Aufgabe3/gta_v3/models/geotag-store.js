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
    #store_array = [];

    addGeoTag(geoTag){
        if (geoTag != undefined){
            var r = 0; 
            while (this.#store_array[r] != undefined){
                r++;
            }
            this.#store_array[r] = geoTag;

        }

    };

    removeGeoTag(geoTag){
        var geoTag_name = geoTag.tag_name;
        var array_length = this.#store_array.length;

        for ( var i = 0 ; i < array_length; i++){
            if (this.#store_array[i].tag_name === geoTag_name){
                break;
            }
        }

        if (i < array_length){
            this.#store_array[i] = undefined;
        } else {
            console.log("GeoTag nicht enthalten.");
        }

    };

    getNearbyGeoTags(location){

    }

}

module.exports = InMemoryGeoTagStore
