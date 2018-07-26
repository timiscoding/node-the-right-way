var EventEmitter = require('events');
var server = new EventEmitter();

server.on('data', function () {
  console.log('Am I waiting for data incoming?');
});
