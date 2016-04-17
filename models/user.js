const Room = require('./room');
const db = require('../config/db');
const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));
const util = require('util');

const User = module.exports = db.Model.extend({
  tableName: 'users',
  rooms() {
    return this.hasMany(Room);
  }
});

User.create = function(user_id) {
  return User.where('github_id', user_id.sub)
    .fetch()
    .then(user => {
      if (user) {
        return Promise.reject(new User.UserAlreadyExistsError());
      }
      return new User({
        github_id: user_id.sub
      }).save()
        .then(user => {
          return {
            user: user
          };
        });
    });
};

User.UserAlreadyExistsError = function() {
  Error.captureStackTrace(this, this.constructor);
  this.name = 'UserAlreadyExists';
  this.message = 'A user with that uuid already exists';
  this.status = 409;
}
util.inherits(User.UserAlreadyExistsError, Error);
