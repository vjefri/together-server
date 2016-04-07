require('./user');

const shortid = require('shortid');

const db = require('../config/db');

const Room = module.exports = db.Model.extend({
  tableName: 'rooms',
  owner() {
    return this.belongsTo('User');
  },
  users() {
    return this.hasMany('User');
  }
});

Room.buildRoom = function(params) {
  return new Room({
    url: shortid.generate(),
    private: params.private || false,
    owner: params.user_id || 9999
  }).save();
};
