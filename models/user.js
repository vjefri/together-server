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
        user.set('uuid', user.get('id'));
        user.set('id', 'me');
        return {
          user: user
        };
      }
      return new User({
        github_id: user_id.sub
      }).save()
        .then(user => {
          user.set('uuid', user.get('id'));
          user.set('id', 'me');
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
        user.set('uuid', user.get('id'));
        user.set('id', 'me');
        return {
          user: user
        };
      } else {
        return Promise.reject(new User.NotFoundError());
      }
    });
};
