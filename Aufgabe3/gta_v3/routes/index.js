// File origin: VS1LAB A3

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
 * 
 * TODO: implement the module in the file "../models/geotag.js"
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 * 
 * TODO: implement the module in the file "../models/geotag-store.js"
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

// TODO: extend the following route example if necessary
router.get('/', (req, res) => {
  const latitude = req.body.latitude || ''; 
  const longitude = req.body.longitude || '';

  const taglist = geoTagStore.getNearbyGeoTags(latitude, longitude, 100); // default radius = 100
  console.log('Nearby taglist:', taglist);
  res.render('index', { taglist, latitude, longitude}); 
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

// TODO: ... your code here ...

router.post('/tagging',(req, res) => {
  console.log("Route to Tagging ...");
  console.log(req.body);
  const latitude = req.body.latitude || ''; 
  const longitude = req.body.longitude || ''; 
  console.log("Lat:" +latitude);
  console.log("Long: "+longitude);
  console.log("name: "+ req.body.name);
  console.log("hashtag: "+ req.body.hashtag);

  const newTag = new GeoTag(req.body.name,latitude, longitude, req.body.hashtag); // create new Tag
  geoTagStore.addGeoTag(newTag); // add new tag to taglist
  //const taglist = geoTagStore.getNearbyGeoTags(latitude, longitude, 100); // default radius = 100
  const taglist = geoTagStore.taglist;
  console.log('taglist:', taglist);
  res.render('index', { taglist, latitude, longitude}); 

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

// TODO: ... your code here ...

router.post('/discovery', (req, res) => {
  const { latitude, longitude, searchterm } = req.body;
  let results = geoTagStore.getNearbyGeoTags(latitude, longitude,100);

  if(searchterm){
    results = geoTagStore.searchNearbyGeoTags(latitude, longitude, 100, searchterm);
  }

  res.render('index', { taglist: results, searchTerm: searchterm, latitude: latitude, longitude: longitude});
});


module.exports = router;
