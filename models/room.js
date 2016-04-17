const User = require('./user');
const shortid = require('shortid');
const Promise = require('bluebird');
const db = require('../config/db');

const Room = module.exports = db.Model.extend({
  tableName: 'rooms',
  owner() {
    return this.belongsTo('User');
  },
  // users() {
  //   return this.hasMany('User');
  // },
  update(params) {
    return this.save(params, { patch: true })
      .then(room => room);
  }
});

Room.buildRoom = function(user_id) {
  return User.where('github_id', user_id)
    .fetch()
    .then(user => {
      return Room.forge({
        url: shortid.generate(),
        owner: user.get('id'),
        code: ''
      }).save();
    });
};

Room.findByUrl = function(url) {
  return Room.where({ url: url })
    .fetch({ require: true })
    .then(function(room) {
      return room;
    })
    .catch(function(err) {
      return Promise.reject(err);
    });
};
