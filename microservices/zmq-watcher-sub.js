'use strict';
const zmq = require('zeromq');

// Create subscriber endpoint
const subscriber = zmq.socket('sub');

// Subscribe to all messages
subscriber.subscribe('');

// Handle message from the publisher
subscriber.on('message', data => {
  const message = JSON.parse(data);
  const date = new Date(message.timestamp);
  console.log(`File "${message.file}" changed at ${date}`);
});

// Connect to publisher
subscriber.connect("tcp://localhost:60400");
