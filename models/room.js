const User = require('./user');
const shortid = require('shortid');
const Promise = require('bluebird');
const db = require('../config/db');

const Room = db.Model.extend({
  tableName: 'rooms',
  owner() {
    return this.belongsTo('User');
  },
  viewers() {
    return this.hasMany('User');
  },
  update(params) {
    return this.save(params, { patch: true })
      .then(room => {
        return {
          room: room
        };
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
        code: ''
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
    .fetch({ require: true })
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
