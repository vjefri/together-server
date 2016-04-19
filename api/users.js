const router = require('express').Router();
const User = require('../models/user');
const API = require('../lib/api');

router.post('/', function(req, res) {
  User.create(req.user)
    .then(API.sendResponse(201, res))
    .catch(User.NoRowsUpdatedError, API.sendResponse(500, res))
});

module.exports = router;
