const request = require('supertest');
const mocha = require('mocha');
const expect = require('chai').expect;
const app = require('../../index');
const io = require('socket.io-client');
const jwt = require('jsonwebtoken');

const socketUrl = 'http://localhost:3003';
const workspace = 'abcd12345';
const testCode = 'one fish, two fish';
const options = {
  transport: ['websocket'],
  'force new connection': true
};

describe('Sockets', function() {

  it('should authenticate sockets', function(done) {
    this.timeout(6000);
    var client = io.connect(socketUrl, options);

    client.on('connect', function() {
      client.emit('authenticate', { jwt: null });

      client.on('unauthorized', function(data) {
        expect(data.data.code).to.equal('invalid_token');
        done();
      });
    });
  });

  it('should send code between two clients', function(done) {
    var clientOne = io.connect(socketUrl, options);
    var clientTwo;
    var clientOneToken = jwt.sign({ sub: 'sockets_user_one' },
      new Buffer(process.env.TOKEN_SECRET, 'base64'), { audience: process.env.TOKEN_AUDIENCE });
    var clientTwoToken = jwt.sign({ sub: 'sockets_user_two' },
      new Buffer(process.env.TOKEN_SECRET, 'base64'), { audience: process.env.TOKEN_AUDIENCE });

    clientOne.on('connect', function() {
      clientOne.emit('authenticate', { token: clientOneToken });

      clientOne.on('authenticated', function() {
        clientOne.emit('join', { url: workspace });

        clientTwo = io.connect(socketUrl, options);

        clientTwo.on('connect', function() {
          clientTwo.emit('authenticate', { token: clientTwoToken });

          clientTwo.on('authenticated', function() {
            clientTwo.emit('join', { url: workspace });

            clientOne.on('newUser', function() {
              clientOne.emit('update', { url: workspace, code: testCode });

              clientTwo.on('incoming', function(data) {
                expect(data.code).to.equal(testCode)
                done();
              });
            });
          });
        });
      });
    });
  });
});
