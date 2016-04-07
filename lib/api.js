const Promise = require('bluebird');

const API = {};

API.sendResponse = function(statusCode, res) {
  return function(body) {
    res.status(statusCode).json(body);
  }
};

module.exports = API;
