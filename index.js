const app = require('./config')();
const http = module.exports = require('http').Server(app);
const io = require('./sockets');

http.listen(app.get('port'), () => {
  console.log('Listening on port', app.get('port'));
});
