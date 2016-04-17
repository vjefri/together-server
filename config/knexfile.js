const path = require('path');

const config = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, '../sqlite/db.sqlite')
    },
    useNullAsDefault: true
  }
};

const knex = require('knex')(config[process.env.NODE_ENV]);

knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    knex.schema.createTable('users', function (user) {
      user.increments('id').primary();
      user.string('github_id', 48);
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

knex.schema.hasTable('rooms').then(function(exists) {
  if (!exists) {
    knex.schema.createTable('rooms', function (room) {
      room.increments('id').primary();
      room.string('url', 16);
      room.string('code', 2000);
      room.integer('owner')
          .references('users.id');
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

module.exports = knex;
