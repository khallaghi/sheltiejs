const amqp = require('amqplib');
function producer(message) {
  amqp.connect('amqp://localhost').then(function (conn) {
    return conn.createChannel().then(function (ch) {
      var ex = 'kubeclient';
      var ok = ch.assertExchange(ex, 'fanout', {durable: false})
      return ok.then(function () {
        ch.publish(ex, '_command', Buffer.from(message));
        console.log(" [x] Sent '%s'", message);
        return ch.close();
      });
    }).finally(function () {
      conn.close();
    });
  }).catch(console.warn);
}
var message = process.argv.slice(2).join(' ') ||
	'info: Hello World!';
producer(message);

