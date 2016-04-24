const mocha = require('mocha');
const expect = require('chai').expect;
const app = require('../../index');
const Room = require('../../models/room');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const TestHelper = require('../test-helper');

describe('Users unit tests', function() {

  before(function() {
    return TestHelper.dropTables()
      .then(function() {
        return TestHelper.seedUser({ github_id: 'user_test_user' });
      });
  });

  it('creates a new user', function(done) {
    var newUser = {
      sub: 'newuser_test_user'
    };

    User.create(newUser)
      .then(built => {
        var user = built.user;

        expect(user.get('github_id')).to.equal('newuser_test_user');
        done();
      });
  });

  it('does not create a new user when the github_id is taken', function(done) {
    User.where('github_id', 'user_test_user')
      .fetch()
      .then(exists => {
        var id = exists.get('id');

        return User.create({ sub: 'user_test_user' })
          .then(old => {
            var user = old.user;

            expect(user.get('id')).to.equal(id);
            done();
          });
      });
  });

  it('finds and returns the current user', function(done) {
    User.findMe({ sub: 'user_test_user' })
      .then(exists => {
        var user = exists.user;

        expect(user.get('github_id')).to.equal('user_test_user');
        done();
      });
  });

  it('should return an error if the current user does not exist', function(done) {
    User.findMe({ sub: 'not_a_real_user' })
      .catch(error => {
        expect(error instanceof Error).to.be.true;
        done();
      });
  });

  it('should check whether a requested user is the current user', function(done) {
    User.where('github_id', 'user_test_user')
      .fetch()
      .then(found => found.get('id'))
      .then(id => User.isCurrentUser(id, { sub: 'user_test_user' }))
      .then(found => {
        var user = found.user;

        expect(user.get('github_id')).to.equal('user_test_user');
        done();
      });
  });

  it('should return a Forbidden error when requested user is not the current user', function(done) {
    User.isCurrentUser(99, { sub: 'user_test_user' })
      .catch(error => {
        expect(error instanceof User.ForbiddenRequestError).to.be.true;
        done();
      });
  });
});
