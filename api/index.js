const router = require('express').Router();
const cors = require('cors');
const rooms = require('./rooms');
const users = require('./users');

router.use('/users', users);
router.use('/rooms', rooms);

module.exports = router;
