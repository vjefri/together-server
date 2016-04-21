const request = require('supertest');
const mocha = require('mocha');
const expect = require('chai').expect;
const app = require('../../index');
const Room = require('../../models/room');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const TestHelper = require('../test-helper');

describe('Rooms API', function() {

  var token = jwt.sign({ sub: 'room_test_user' },
    new Buffer(process.env.TOKEN_SECRET, 'base64'), { audience: process.env.TOKEN_AUDIENCE });

  before(function() {
    return TestHelper.dropTables()
      .then(function() {
        return TestHelper.seedUser({ github_id: 'room_test_user' });
      });
  });

  it('creates a new room', function(done) {
    request(app)
      .post('/api/rooms')
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .end(function(err, res) {
        const room = res.body.room;
        const keys = Object.keys(room);

        expect(keys.length).to.equal(4);
        expect(room.url).to.be.a('string');
        done();
      });
  });

  it('finds a room by URL', function (done) {

    Room.forge({
      url: 'abc123',
      owner: 1,
      code: 'One fish, two fish'
    }).save()
      .then(room => room.get('url'))
      .then(function(roomId) {
        request(app)
          .get(`/api/rooms/${roomId}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .end(function(err, res) {
            const room = res.body.room;
            const keys = Object.keys(room);

            expect(keys.length).to.equal(4);
            expect(room.url).to.equal('abc123');
            expect(room.code).to.equal('One fish, two fish');
            done();
          });
      });
  });

  it('should make the current user the room\'s owner', function(done) {
    request(app)
      .post('/api/rooms')
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .end(function(err, res) {
        var room = res.body.room;
        var url = room.url;

        Room.where('url', url )
            .fetch()
            .then(room => room.get('owner'))
            .then(owner => {
              return User.where({ id: owner })
                .fetch()
                .then(user => {
                  expect(user.get('github_id')).to.equal('room_test_user');
                  done();
                });
            });
      });
  });

  it('should return a user\'s rooms', function(done) {
    request(app)
      .get('/api/rooms')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .end(function(err, res) {
        var rooms = res.body.rooms;

        expect(rooms).to.have.length(3);

        rooms.forEach(room => {
          expect(room.url).to.be.a('string');
        });
        done();
      });
  });

  it('should return an empty array if a user has no rooms', function(done) {
    var token = jwt.sign({ sub: 'second_room_test_user' },
      new Buffer(process.env.TOKEN_SECRET, 'base64'), { audience: process.env.TOKEN_AUDIENCE });

    TestHelper.seedUser({ github_id: 'second_room_test_user' })
      .then(() => {
        request(app)
          .get('/api/rooms')
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .end(function(err, res) {
            var rooms = res.body.rooms;

            expect(rooms).to.be.an('array');
            expect(rooms).to.have.length(0);

            User.where('github_id', 'second_room_test_user')
              .fetch({ withRelated: ['rooms'] })
              .then(user => {
                var rooms = user.related('rooms');

                expect(rooms).to.have.length(0);
                done();
              });
          });
      });
  });
});
