'use strict';
const cluster = require('cluster');
const fs = require('fs');
const zmq = require('zeromq');

const numWorkers = require('os').cpus().length;

if (cluster.isMaster) {

  // Master process creates ROUTER and DEALER sockets and binds endpoints
  const router = zmq.socket('router').bind('tcp://127.0.0.1:60401');
  const dealer = zmq.socket('dealer').bind('ipc://filer-dealer.ipc');

  // Forward messages between the router and dealer
  router.on('message', (...frames) => dealer.send(frames));
  dealer.on('message', (...frames) => router.send(frames));

  // Listen for workers to come online
  cluster.on('online', worker => console.log(`Worker ${worker.process.pid} is online.`));

  // Restart worker if it dies
  cluster.on('exit', (worker, code, signal) => {
    console.log('Worker %d died (%s) :(', worker.process.pid, signal || code);
    cluster.fork();
  });

  // Fork a worker process for each CPU
  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }
} else {

  // Worker process create a REP socket and connect to the DEALER
  const responder = zmq.socket('rep').connect('ipc://filer-dealer.ipc');

  responder.on('message', data => {

    // Parse incoming message
    const request = JSON.parse(data);
    console.log(`${process.pid} received request for: ${request.path}`);

    // Read the file and reply with content
    fs.readFile(request.path, (err, content) => {
      console.log(`${process.pid} sending response`);
      responder.send(JSON.stringify({
        content: content.toString(),
        timestamp: Date.now(),
        pid: process.pid
      }));
    });

  });

}
