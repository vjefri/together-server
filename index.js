const app = require('./config')();
const http = module.exports = require('http').Server(app);
const io = require('./sockets');
const cors = require('cors');
const routes = require('./api');
const API = require('./lib/api');

const corsOptions = {
  origin: 'http://localhost:4200'
};

app.use('/api', cors(corsOptions), API.authCheck, routes);
app.use(API.notFound);
app.use(API.handleErrors);

http.listen(app.get('port'), () => {
  console.log('Listening on port', app.get('port'));
});
