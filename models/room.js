require('./user');

const db = require('../config/db');

const Room = db.Model.extend({
  tableName: 'rooms',
  owner() {
    return this.belongsTo('User');
  },
  users() {
    return this.hasMany('User');
  }
});

module.exports = Room;
