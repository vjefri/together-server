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

User.hashPassword = function(password) {
  return bcrypt.hashAsync(password, null, null)
    .then(function(hash) {
      return hash;
    })
    .catch(function(err) {
      return Promise.reject(err);
    });
};

User.compareHash = function(password, hash) {
  return bcrypt.compare(password, hash)
    .then(function(res) {
      return res;
    })
    .catch(function(err) {
      return Promise.reject(err);
    })
};
