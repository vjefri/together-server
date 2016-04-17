const router = require('express').Router();
const Room = require('../models/room');
const User = require('../models/user');
const API = require('../lib/api');

/* GET /rooms */
router.get('/', function (req, res) {
  Room.findAllForUser(req.user.sub)
    .then(API.sendResponse(200, res))
    .catch(User.NotFoundError, API.sendResponse(404, res));
});

/* POST /rooms */
router.post('/', function (req, res) {
  Room.buildRoom(req.user.sub)
    .then(API.sendResponse(201, res))
    .catch(User.NotFoundError, API.sendResponse(404, res));
});

/* GET /rooms/:id */
router.get('/:id', function (req, res) {
  Room.findByUrl(req.params.id)
    .then(API.sendResponse(200, res))
    .catch(Room.NotFoundError, API.sendResponse(404, res));
});

/* PUT /rooms/:id */
router.put('/:id', function (req, res) {
  Room.findByUrl(req.params.id)
    .then(room => room.update(req.body))
    .then(API.sendResponse(200, res))
    .catch(API.sendResponse(404, res));
});

module.exports = router;
