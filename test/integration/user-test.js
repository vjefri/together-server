const request = require('supertest');
const mocha = require('mocha');
const expect = require('chai').expect;
const app = require('../../index');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');

describe('Users API', function() {

  var token = jwt.sign({ sub: 'test_user' },
    new Buffer(process.env.TOKEN_SECRET, 'base64'), { audience: process.env.TOKEN_AUDIENCE });

  it('creates a new user and returns 201', function(done) {
    request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .end(function() {
        User.where('github_id', 'test_user' )
          .fetch()
          .then(user => {
            expect(user.get('github_id')).to.equal('test_user');
            done();
          });
      });
  });
});
