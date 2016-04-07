const app = require('./config')();
const http = module.exports = require('http').Server(app);
const io = require('./sockets');
const cors = require('cors');
const API = require('./api');

const corsOptions = {
  origin: 'http://localhost:4200'
};

app.use('/api', cors(corsOptions), API);

http.listen(app.get('port'), () => {
  console.log('Listening on port', app.get('port'));
});
