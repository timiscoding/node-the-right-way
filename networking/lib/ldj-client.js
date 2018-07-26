'use strict';
const EventEmitter = require('events').EventEmitter;
class LDJClient extends EventEmitter {
  constructor(stream) {
    if (!(stream instanceof EventEmitter)) {
      throw new TypeError('Expected stream to be an instance of EventEmitter');
    }
    super();
    let buffer = '';
    stream.on('data', data => {
      buffer += data;
      let boundary = buffer.indexOf('\n');
      while (boundary !== -1) {
        const input = buffer.substring(0, boundary);
        buffer = buffer.substring(boundary + 1);
        this.emit('message', JSON.parse(input));
        boundary = buffer.indexOf('\n');
      }
    });

    stream.on('close', () => {
      if (buffer) {
        try {
          this.emit('message', JSON.parse(buffer));
        } catch (err) {
          console.log('Invalid JSON', err);
        }
      }
    });
  }

  static connect(stream) {
    return new LDJClient(stream);
  }
}

module.exports = LDJClient;
