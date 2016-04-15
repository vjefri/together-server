const router = require('express').Router();
const User = require('../models/user');
const API = require('../lib/api');

router.post('/', function(req, res) {
  User.create(req.body)
    .then(API.sendResponse(201), res)
    .catch(User.NoRowsUpdated, API.sendReponse(500, res));
});

module.exports = router;
