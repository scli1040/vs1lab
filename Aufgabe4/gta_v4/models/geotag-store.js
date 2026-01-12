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
    #nextId = 1;

    constructor() {
        this.#geoTags = [];
        this.#nextId = 1;
    }

    addGeoTag(geotag) {
        geotag.id = this.#nextId++;
        this.#geoTags.push(geotag);
    }

    removeGeoTag(name) {
        this.#geoTags = this.#geoTags.filter(tag => tag.name !== name);
    }
    
    removeGeoTagById(id) {
        // id zu einer Nummer umwandeln
        const numericId = Number(id);
        const index = this.#geoTags.findIndex(tag => tag.id === numericId);
        if (index !== -1) {
            this.#geoTags.splice(index, 1);
            return true;
        }
        return false;
    }

    getAllGeoTags() {
        return this.#geoTags;
    }

    getGeoTag(id) {
        const numericId = Number(id);
        return this.#geoTags.find(tag => tag.id === numericId);
    }

    updateGeoTag(id, newTag) {
        const numericId = Number(id);
        const index = this.#geoTags.findIndex(tag => tag.id === numericId);
        if (index !== -1) {
            // ID behalten & nur die Felder aktualisieren
            newTag.id = numericId; 
            this.#geoTags[index] = newTag;
            return newTag;
        }
        return null;
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

    /* Haversine Formel */
    
    #calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius der Erde in km
        const dLat = this.#deg2rad(lat2 - lat1);
        const dLon = this.#deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.#deg2rad(lat1)) * Math.cos(this.#deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    #deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

}

module.exports = InMemoryGeoTagStore
