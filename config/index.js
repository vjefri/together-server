require('dotenv').config();

const app = require('express')();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const db = require('./db');

module.exports = function() {

  app.set('port', process.env.PORT || 3003);

  app.use(bodyParser.json());

  if (process.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
  }

  return app;
};
