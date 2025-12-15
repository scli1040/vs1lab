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
    #geoTags = [];

    constructor() {
        this.#geoTags = [];
    }

    addGeoTag(geotag) {
        this.#geoTags.push(geotag);
    }

    removeGeoTag(name) {
        this.#geoTags = this.#geoTags.filter(tag => tag.name !== name);
    }

    getNearbyGeoTags(latitude, longitude, radius) {
        return this.#geoTags.filter(tag => {
            const distance = this.#calculateDistance(latitude, longitude, tag.latitude, tag.longitude);
            return distance <= radius;
        });
    }

    searchNearbyGeoTags(latitude, longitude, radius, keyword) {
        const nearbyTags = this.getNearbyGeoTags(latitude, longitude, radius);

        if (!keyword) {
            return nearbyTags;
        }

        const searchTerm = keyword.toLowerCase();

        return nearbyTags.filter(tag => 
            (tag.name && tag.name.toLowerCase().includes(searchTerm)) ||
            (tag.hashtag && tag.hashtag.toLowerCase().includes(searchTerm))
        );
    }

    #calculateDistance(lat1, lon1, lat2, lon2) {
        const dx = lat2 - lat1;
        const dy = lon2 - lon1;
        return Math.sqrt(dx * dx + dy * dy) * 111;
    }

}

module.exports = InMemoryGeoTagStore
