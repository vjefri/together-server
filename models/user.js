require('./room');

const db = require('../config/db');
const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));

const User = module.exports = db.Model.extend({
  tableName: 'users',
  rooms() {
    return this.hasMany('Room');
  }
});

User.create = function(user) {
  return new User({
    github_id: user.sub
  }).save();
};
