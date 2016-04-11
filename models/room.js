require('./user');

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

Room.buildRoom = function(params) {
  return new Room({
    url: shortid.generate(),
    private: params.private || false,
    owner: params.user_id || 9999, //TODO
    code: params.code || ''
  }).save();
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
