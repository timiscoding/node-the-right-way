const start = process.hrtime();

setTimeout(() => {
  const end = process.hrtime(start);
  console.log(`timeout callback executed after ${end[0]}s and ${end[1] / Math.pow(10, 6)}ms`, end);
}, 1000);
