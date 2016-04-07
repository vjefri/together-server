const server = require('../index');
const io = require('socket.io')(server);

io.sockets.on('connection', function(socket) {
  socket.on('join', function(data) {
    socket.join(data.url);
    socket.broadcast.to(data.url).emit('newUser');
  });

  socket.on('update', function(data) {
    socket.broadcast.to(data.url).emit('incoming', { code: data.code });
  });
});

module.exports = io;
