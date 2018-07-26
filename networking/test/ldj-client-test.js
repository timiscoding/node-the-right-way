'use strict';
const assert = require('assert');
const EventEmitter = require('events').EventEmitter;
const LDJClient = require('../lib/ldj-client');

describe('LDJClient', () => {
  let stream = null;
  let client = null;

  beforeEach(() => {
    stream = new EventEmitter();
    client = new LDJClient(stream);
  });

  it('should emit a message event from a single data event', done => {
    client.on('message', message => {
      assert.deepEqual(message, {foo: 'bar'});
      done();
    });
    stream.emit('data', '{"foo":"bar"}\n');
  });

  it('should emit a message event from split data events', done => {
    client.on('message', message => {
      assert.deepEqual(message, { foo: 'bar' });
      done();
    });

    stream.emit('data', '{"foo":');
    stream.emit('data', '"bar"}\n');
  });

  it('should throw an exception when given a null stream', () => {
    try {
      client = new LDJClient(null);
    } catch (err) {
      assert.equal(err.name, 'TypeError');
    }
  });

  it('should emit a message if stream data omits newline and it is followed by a close event', done => {
    client.on('message', message => {
      assert.deepEqual(message, {foo: 'bar'});
      done();
    })
    stream.emit('data', '{"foo":"bar"}');
    stream.emit('close');
  });
})
