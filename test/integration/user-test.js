const request = require('supertest');
const mocha = require('mocha');
const expect = require('chai').expect;
const app = require('../../index');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');

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
});
