const knex = require('../config/knexfile');
const Promise = require('bluebird');
const User = require('../models/user');
const Room = require('../models/room');
const shortid = require('shortid');

const TestHelper = {};
const tables = ['rooms', 'users'];

TestHelper.dropTables = function() {
  return Promise.each(tables, table => {
    return knex(table).truncate();
  });
};

TestHelper.seedUser = function(user) {
  return new Promise(function(resolve) {
    return User.forge(user).save().then(resolve);
  });
};

TestHelper.buildNRooms = function(n) {
  return function loop(value) {
    if (value !== n) {
      return Promise.delay(0).then(() => {
        return Room.forge({
          url: shortid.generate(),
          owner: 1,
          code: '',
          name: '',
          language: ''
        }).save();
      })
      .then(() => value+1)
      .then(loop);
    }
    return Promise.resolve();
  }(0);
};

module.exports = TestHelper;
