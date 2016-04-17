const knex = require('../config/knexfile');
const Promise = require('bluebird');
const User = require('../models/user');

const TestHelper = {};
const tables = ['rooms', 'users'];

TestHelper.dropTables = function(tableName) {
  return Promise.each(tables, table => {
    return knex(table).truncate();
  });
};

TestHelper.seedUser = function(user) {
  return new Promise(function(resolve) {
    return User.forge(user).save().then(resolve);
  });
};

module.exports = TestHelper;
