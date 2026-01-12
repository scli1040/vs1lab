// File origin: VS1LAB A3, A4

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');

const InMemoryGeoTagStore = require('../models/geotag-store');
const GeoTagExamples = require('../models/geotag-examples');

// Initialize Store and populate with examples
const store = new InMemoryGeoTagStore();
const exampleList = GeoTagExamples.tagList;
exampleList.forEach(tagData => {
    // tagData format: [name, latitude, longitude, hashtag]
    const newTag = new GeoTag(tagData[0], tagData[1], tagData[2], tagData[3]);
    store.addGeoTag(newTag);
});

// App routes (A3)

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

router.get('/', (req, res) => {
  res.render('index', { 
      taglist: [], 
      latitude: null, 
      longitude: null 
  });
});

/**
 * Route '/tagging' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the tagging form in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Based on the form data, a new geotag is created and stored.
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the new geotag.
 * To this end, "GeoTagStore" provides a method to search geotags 
 * by radius around a given location.
 */

router.post('/tagging', (req, res) => {
    const { name, latitude, longitude, hashtag } = req.body;
    
    const newTag = new GeoTag(name, latitude, longitude, hashtag);
    store.addGeoTag(newTag);

    // Search radius in km (approx)
    const radius = req.body.radius || 10;
    const nearbyTags = store.getNearbyGeoTags(latitude, longitude, radius);

    res.render('index', { 
        taglist: nearbyTags, 
        latitude: latitude, 
        longitude: longitude 
    });
});

/**
 * Route '/discovery' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the discovery form in the body.
 * This includes coordinates and an optional search term.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the given coordinates.
 * If a search term is given, the results are further filtered to contain 
 * the term as a part of their names or hashtags. 
 * To this end, "GeoTagStore" provides methods to search geotags 
 * by radius and keyword.
 */


router.get('/discovery', (req, res) => {
  res.redirect('/');
});

router.post('/discovery', (req, res) => {
    const {name, latitude, longitude, searchterm } = req.body;
    
    const radius = req.body.radius || 10;
    const nearbyTags = store.searchNearbyGeoTags(latitude, longitude, radius, searchterm);

    res.render('index', { 
        taglist: nearbyTags, 
        latitude: latitude, 
        longitude: longitude 
    });
});


/* ******************************** */


// API routes (A4)

/*
* 2 Routen anlegen von Ressourcen,
* 3 Routen für lesen, ändern, löschen
*/

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */

router.get('/api/geotags', (req, res) => {
  const { searchterm, latitude, longitude } = req.query;
  const radius = req.query.radius || 10;
  
    //Mit Radius Suche
  if (latitude && longitude) {
      if (searchterm) {
           res.json(store.searchNearbyGeoTags(latitude, longitude, radius, searchterm));
      } else {
           res.json(store.getNearbyGeoTags(latitude, longitude, radius));
      }
  } else {
    //ohne Radius Suche
      let allTags = store.getAllGeoTags();
      if (searchterm) {
          const term = searchterm.toLowerCase();
          allTags = allTags.filter(tag => 
            (tag.name && tag.name.toLowerCase().includes(term)) ||
            (tag.hashtag && tag.hashtag.toLowerCase().includes(term))
          );
      }
      res.json(allTags);
  }
});



/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */

router.post('/api/geotags', (req, res) => {
  const { name, latitude, longitude, hashtag } = req.body;
  const newTag = new GeoTag(name, latitude, longitude, hashtag);
  store.addGeoTag(newTag);
  
  res.status(201) //201: created
     .location(`/api/geotags/${newTag.id}`)
     .json(newTag);
});



/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */

router.get('/api/geotags/:id', (req, res) => {
  const tag = store.getGeoTag(req.params.id);
  if (tag) {
      res.json(tag);
  } else {
      res.status(404).send();
  }
});


/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 * 
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response. 
 */

router.put('/api/geotags/:id', (req, res) => {
  const { name, latitude, longitude, hashtag } = req.body;
  const newTag = new GeoTag(name, latitude, longitude, hashtag);
  const updatedTag = store.updateGeoTag(req.params.id, newTag);
  if (updatedTag) {
      res.json(updatedTag);
  } else {
      res.status(404).send();
  }
});




/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */

router.delete('/api/geotags/:id', (req, res) => {
  const tag = store.getGeoTag(req.params.id);
  if (tag) {
      store.removeGeoTagById(req.params.id);
      res.json(tag);
  } else {
      res.status(404).send();
  }
});




module.exports = router;