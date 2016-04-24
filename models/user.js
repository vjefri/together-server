const Room = require('./room');
const db = require('../config/db');
const Promise = require('bluebird');
const util = require('util');

const User = db.Model.extend({
  tableName: 'users',
  rooms() {
    return this.hasMany('Room', 'owner');
  }
});

module.exports = db.model('User', User);

User.create = function(user_id) {
  return User.where('github_id', user_id.sub)
    .fetch()
    .then(user => {
      if (user) {
        return {
          user: user
        };
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

User.findMe = function(user_id) {
  return User.where('github_id', user_id.sub)
    .fetch()
    .then(user => {
      if (user) {
        return {
          user: user
        };
      } else {
        return Promise.reject(new User.NotFoundError());
      }
    });
};

User.isCurrentUser = function(id, user_id) {
  return User.where('github_id', user_id.sub)
    .fetch()
    .then(user => {
      if (user) {
        if (user.get('id') === id) {
          return {
            user: user
          };
        } else {
          return Promise.reject(new User.ForbiddenRequestError());
        }
      } else {
        return Promise.reject(new User.NotFoundError());
      }
    });
};

User.ForbiddenRequestError = function() {
  Error.captureStackTrace(this, this.constructor);
  this.name = 'ForbiddenRequest';
  this.message = 'Forbidden request for a user';
  this.status = 403;
};
util.inherits(User.ForbiddenRequestError, Error);
