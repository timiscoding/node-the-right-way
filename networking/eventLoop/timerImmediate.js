/*
As you might guess, this program will always print setTimeout before setImmediate
because the expired timer callbacks are processed before immediates. But the
output of this program can never be guaranteed! If you run this program multiple
times, you will get different outputs.

This is because setting a timer with zero expiration time can never assure that
the timer callback will be called exactly after zero seconds. Due to this reason,
when the event loop starts it might not see the expired timer immediately. Then
the event loop will move to the I/O phase and then to the immediates queue.
Then it will see that there is an event in the immediates queue and it will
process it.
*/

setTimeout(function () {
  console.log('setTimeout')
}, 0);
setImmediate(function () {
  console.log('setImmediate')
});
