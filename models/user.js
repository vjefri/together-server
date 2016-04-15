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
  return User.hashPassword(user.password)
    .then(hash => {
      return new User({
        email: user.email,
        password: hash
      })
    })
    .then(user => user.save({ require: true }))
    .then(user)
    .catch(Promise.reject(err));
};

User.hashPassword = function(password) {
  return bcrypt.hashAsync(password, null, null)
    .then(hash)
    .catch(Promise.reject(err));
};

User.compareHash = function(password, hash) {
  return bcrypt.compareAsync(password, hash)
    .then(res)
    .catch(Promise.reject(err))
};
