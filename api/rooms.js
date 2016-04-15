const router = require('express').Router();
const Room = require('../models/room');
const API = require('../lib/api');

/* GET /rooms */
router.get('/', function (req, res) {
  Room.fetchAll()
    .then(API.sendResponse(200, res));
});

/* POST /rooms */
router.post('/', function (req, res) {
  const room = {
    user_id: req.user,
    private: req.body.private
  };

  Room.buildRoom(room)
    .then(API.sendResponse(201, res));
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
