const request = require('supertest');
const mocha = require('mocha');
const expect = require('chai').expect;
const app = require('../../index');
const Room = require('../../models/room');
const jwt = require('jsonwebtoken');

describe('Rooms API', function() {

  var token = jwt.sign({ sub: 'test_user' },
    new Buffer(process.env.TOKEN_SECRET, 'base64'), { audience: process.env.TOKEN_AUDIENCE });

  it('returns all rooms', function(done) {
    request(app)
      .get('/api/rooms')
      .set('Authorization', `Bearer ${token}`)
      .expect(200, done);
  });

  it('creates a new room', function(done) {
    request(app)
      .post('/api/rooms')
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .end(function(err, res) {
        const room = res.body.room;
        const keys = Object.keys(room);

        expect(keys.length).to.equal(5);
        expect(room.url).to.be.a('string');
        done();
      });
  });

  it('finds a room by URL', function (done) {

    Room.forge({
      url: 'abc123',
      private: false,
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

            expect(keys.length).to.equal(5);
            expect(room.url).to.equal('abc123');
            expect(room.code).to.equal('One fish, two fish');
            done();
          });
      });
  });
});
