var http = require('http');
var server = http.createServer();
server.on('listening', function () {
  if (process.send) {
    process.send({ event: 'listening' });
  }
});
server.listen(61661);
