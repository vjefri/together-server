require('./room');

const db = require('../config/db');

const User = db.Model.extend({
  tableName: 'users',
  rooms() {
    return this.hasMany('Room');
  }
});

module.exports = User;
