const router = require('express').Router();
const User = require('../models/user');
const API = require('../lib/api');

router.post('/', function(req, res) {
  User.create(req.user)
    .then(API.sendResponse(201, res))
    .catch(User.NoRowsUpdatedError, API.sendResponse(500, res))
});

router.get('/me', function(req, res) {
  User.findMe(req.user)
    .then(API.sendResponse(200, res))
    .catch(User.NotFoundError, API.sendResponse(404, res));
});

router.get('/:id', function(req, res) {
  User.isCurrentUser(req.params.id, req.user)
    .then(API.sendResponse(200, res))
    .catch(User.ForbiddenRequestError, API.sendResponse(403, res));
})

module.exports = router;
