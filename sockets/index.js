const server = require('../index');
const io = require('socket.io')(server);
const jwt = require('socketio-jwt');

const jwtOptions = {
  secret: new Buffer(process.env.TOKEN_SECRET, 'base64'),
  audience: process.env.TOKEN_AUDIENCE,
  timeout: 8000
};

io.sockets.on('connection', jwt.authorize(jwtOptions))
  .on('authenticated',  function(socket) {
    socket.on('join', function(data) {
      socket.join(data.url);
      socket.broadcast.to(data.url).emit('newUser');
    });

    socket.on('update', function(data) {
      socket.broadcast.to(data.url).emit('incoming', { code: data.code });
    });
});

module.exports = io;
