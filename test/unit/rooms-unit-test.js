const mocha = require('mocha');
const expect = require('chai').expect;
const app = require('../../index');
const Room = require('../../models/room');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const TestHelper = require('../test-helper');

describe('Rooms unit tests', function() {

  before(function() {
    return TestHelper.dropTables()
      .then(function() {
        return TestHelper.seedUser({ github_id: 'room_test_user' });
      });
  });

  it('creates a new room', function(done) {

    Room.buildRoom('room_test_user')
      .then(built => {
        var room = built.room;
        var keys = Object.keys(room);

        expect(keys).to.have.length(7);
        expect(room.get('url')).to.be.a('string');
        done();
      });
  });

  it('finds a room by URL', function(done) {

    Room.buildRoom('room_test_user')
      .then(built => {
        return Room.findByUrl(built.room.get('url'))
          .then(found => {
            var room = found.room;
            var keys = Object.keys(room);
            var owner = room.related('owner');

            expect(keys).to.have.length(7);
            expect(room.get('url')).to.be.a('string');
            expect(owner.get('github_id')).to.equal('room_test_user');
            done();
          });
      });
  });

  it('finds all rooms for a user', function(done) {
    TestHelper.buildNRooms(3)
      .then(() => {
        return Room.findAllForUser('room_test_user')
          .then(found => {
            var rooms = found.rooms;

            expect(rooms).to.have.length(5);
            rooms.forEach(room => {
              expect(room.get('url')).to.be.a('string');
            })
            done();
          });
      });
  });
});
