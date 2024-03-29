const request = require('supertest');
const mocha = require('mocha');
const expect = require('chai').expect;
const app = require('../../index');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const TestHelper = require('../test-helper');

describe('Users API', function() {

  var token = jwt.sign({ sub: 'users_test_user' },
    new Buffer(process.env.TOKEN_SECRET, 'base64'), { audience: process.env.TOKEN_AUDIENCE });

  it('creates a new user and returns 201', function(done) {
    request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .end(function() {
        User.where('github_id', 'users_test_user' )
          .fetch()
          .then(user => {
            expect(user.get('github_id')).to.equal('users_test_user');
            done();
          });
      });
  });

  it('should return user if it already exists', function(done) {
    request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .end(function(err, res) {
        var user = res.body.user;

        expect(user.github_id).to.equal('users_test_user');
        done();
      });
  });

  it('should return the current user for GET /users/me', function(done) {
    request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .end(function(err, res) {
        var user = res.body.user;

        expect(user.github_id).to.equal('users_test_user');
        done();
      });
  });

  it ('should return 403 if requesting another user', function(done) {
    User.forge({
      github_id: 'another_test_user'
    })
    .save()
    .then(user => {
      request(app)
        .get('/api/users/' + user.id)
        .set('Authorization', `Bearer ${token}`)
        .expect(403, done);
    });
  });
});
