'use strict';
const fs = require('fs');
const net = require('net');
const filename = process.argv[2];
const socket = '/tmp/watcher.sock';

if (!filename) {
  throw Error('Error: No filename specified.');
}

if (fs.existsSync(socket)) {
  fs.unlinkSync(socket);
}

net.createServer(connection => {
  // reporting
  console.log('Subscriber connected');
  connection.write(`Now watching "${filename}" for changes...\n`);

  // watcher setup
  const watcher =
    fs.watch(filename, () => connection.write(`File changed: ${new Date()}\n`));

    // cleanup
    connection.on('close', () => {
      console.log('Subscriber disconnected.');
      watcher.close();
    });

    connection.on('error', (err) => {
      console.log(`Error: ${err}`);
    });
}).listen(socket, () => console.log('Listening for subscribers...'));
