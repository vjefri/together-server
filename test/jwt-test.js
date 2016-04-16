const request = require('supertest');
const mocha = require('mocha');
const expect = require('chai').expect;
const app = require('../index');
const jwt = require('jsonwebtoken');

describe('Token authentication', function() {

  var token = jwt.sign({ sub: 'test_user' },
    new Buffer(process.env.TOKEN_SECRET, 'base64'), { audience: process.env.TOKEN_AUDIENCE });

  it('should require token authentication for API endpoints', function(done) {
    request(app)
      .post('/api/rooms')
      .expect(401, done);
  });
});
