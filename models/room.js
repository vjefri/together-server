const User = require('./user');
const shortid = require('shortid');
const Promise = require('bluebird');
const db = require('../config/db');
const util = require('util');

const Room = db.Model.extend({
  tableName: 'rooms',
  owner() {
    return this.belongsTo('User', 'owner');
  },
  viewers() {
    return this.hasMany('User');
  },
  update(params, user_id) {
    const url = this.get('url');
    const name = this.get('name');
    const owner = this.related('owner');

    if (params.url !== undefined && params.url !== url) {
      return Promise.reject(new Room.ForbiddenRequestError());
    }
    if (owner.get('github_id') !== user_id && params.name !== name && params.name !== undefined) {
      return Promise.reject(new Room.ForbiddenRequestError());
    }
    return this.save(params, { patch: true })
      .then(room => {
        return {
          room: room
        };
      })
      .catch(() => {
        return Promise.reject(new Room.NoRowsUpdatedError());
      });
  }
});

module.exports = db.model('Room', Room);

Room.buildRoom = function(user_id) {
  return User.where('github_id', user_id)
    .fetch()
    .then(user => {
      if (!user) {
        return Promise.reject(new User.NotFoundError());
      }
      return Room.forge({
        url: shortid.generate(),
        owner: user.get('id'),
        code: '',
        name: '',
        language: ''
      }).save()
        .then(room => {
          return {
            room: room
          }
        });
    });
};

Room.findByUrl = function(url) {
  return Room.where({ url: url })
    .fetch({ withRelated: ['owner'], require: true })
    .then(room => {
      return {
        room: room
      };
    })
    .catch(Promise.reject);
};

Room.findAllForUser = function(user_id) {
  return User.where({ github_id: user_id })
    .fetch({ withRelated: ['rooms'] })
    .then(user => {
      return {
        rooms: user.related('rooms')
      };
    })
    .catch(err => {
      return Promise.reject(new User.NotFoundError())
    });
};

Room.ForbiddenRequestError = function() {
  Error.captureStackTrace(this, this.constructor);
  this.name = 'ForbiddenRequest';
  this.message = 'Forbidden request for a room';
  this.status = 403;
};
util.inherits(Room.ForbiddenRequestError, Error);
