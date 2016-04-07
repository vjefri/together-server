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
    user_id: req.decoded,
    private: req.body.private
  };

  Room.buildRoom(room)
    .then(API.sendResponse(201, res));
});

/* GET /rooms/:id */
router.get('/:id', function (req, res) {
  res.sendStatus(200);
});

/* PUT /rooms/:id */
router.put('/:id', function (req, res) {
  res.sendStatus(201);
});

module.exports = router;
