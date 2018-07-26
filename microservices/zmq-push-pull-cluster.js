const cluster = require('cluster');
const zmq = require('zeromq');
const os = require('os');

if (cluster.isMaster) {
  const jobs = Array(30).fill().map((j, i) => ({
    data: `Job ${i}`
  }));
  let workersReady = 0;
  const numCPUs = os.cpus().length;
  // Master process creates PUSH and PULL sockets and binds endpoints
  const pusher = zmq.socket('push').bind('ipc://jobs-pusher.ipc');
  const puller = zmq.socket('pull').bind('ipc://worker-pusher.ipc');

  // Listen for message event with ready set and increment counter
  puller.on('message', data => {
    const message = JSON.parse(data);

    if (message.ready) {
      console.log('Worker %d ready.', message.pid);
      workersReady++;
    }

    if (workersReady === 4 && jobs.length) {
      while (jobs.length) {
        const serialized = JSON.stringify(jobs.pop());
        // console.log('send job', serialized);
        pusher.send(serialized);
      }
    }

    if (message.result) {
      console.log(`Worker %d result: %s`, message.pid, message.result);
    }
  });

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('online', worker => {
    console.log(`Worker ${worker.process.pid} online.`)
  });

} else {

  // Worker process creates PUSH and PULL sockets and connects to Master
  const puller = zmq.socket('pull').connect('ipc://jobs-pusher.ipc');
  const pusher = zmq.socket('push').connect('ipc://worker-pusher.ipc');

  pusher.send(JSON.stringify({ ready: true, pid: process.pid }));

  puller.on('message', data => {
    const message = JSON.parse(data);
    console.log('Worker %d rec job %s', process.pid, data);

    setTimeout(() => {
      pusher.send(JSON.stringify({
        result: message.data.toUpperCase(),
        pid: process.pid,
      }));
    }, Math.round(1000 * Math.random()));

  });
}
