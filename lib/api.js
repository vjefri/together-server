const Promise = require('bluebird');
const jwt = require('express-jwt');

const API = {};

API.sendResponse = function(statusCode, res) {
  return function(body) {
    res.status(statusCode).json(body);
  }
};

API.authCheck = jwt({
  secret: new Buffer(process.env.TOKEN_SECRET, 'base64'),
  audience: process.env.TOKEN_AUDIENCE
});

API.notFound = function(req, res, next) {
  res.status(404).json({ message: 'Not Found' });
};

API.handleErrors = function(err, req, res, next) {
  res.status(err.status).json({ message: err.message });
};

module.exports = API;
