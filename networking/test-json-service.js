'use strict';
const server = require('net').createServer(connection => {
  console.log(('Subscriber connected.'));

  // Two message chunks that together make a whole message
  const firstChunk = '{"type":"changed","timesta';
  const secondChunk = 'mp":1450694370094}\n';

  // Send the first chunk immediately
  connection.write(firstChunk);

  // After a short delay, send the other chunk
  const timer = setTimeout(() => {
    connection.write(secondChunk);
    connection.end();
  }, 100);

  // Clear timer when the connection ends
  connection.on('end', () => {
    clearTimeout(timer);;
    console.log('Subscriber disconnected');
  });

  connection.on('error', (err) => {
    console.error(`ERROR: ${err}`);
  });
});
server.listen(60300, function() {
  console.log('Test server listening for subscribers...');
});
