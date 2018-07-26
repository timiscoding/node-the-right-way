const LdjClient = require('./lib/ldj-client');
const EventEmitter = require('events').EventEmitter;

const stream = new EventEmitter();
LdjClient.connect(stream);
stream.emit('data', '1');

stream.emit('data', '2');
