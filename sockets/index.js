const server = require('../index');
const io = require('socket.io')(server);

io.sockets.on('connection', function(socket) {
  console.log('connected')
  socket.on('join', function(data) {
    console.log('room', data.url);
    socket.join(data.url);
  });

  socket.on('update', function(data) {
    console.log('room', data.url, 'code', data.code);
    socket.broadcast.to(data.url).emit('incoming', { code: data.code });
  })
});

module.exports = io;
