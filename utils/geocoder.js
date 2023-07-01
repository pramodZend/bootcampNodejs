const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'google',
  fetch: 'customFetchImplementation',
  apiKey: process.env.API_KEY,// for Mapquest, OpenCage, Google Premier
  formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);
module.exports = geocoder;