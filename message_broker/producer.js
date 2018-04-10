const amqp = require('amqplib');
function producer(message) {
  amqp.connect('amqp://localhost').then(function (conn) {
    return conn.createChannel().then(function (ch) {
      var ex = 'logs';
      var ok = ch.assertExchange(ex, 'fanout', {durable: false})
      return ok.then(function () {
        ch.publish(ex, '', Buffer.from(message));
        console.log(" [x] Sent '%s'", message);
        return ch.close();
      });
    }).finally(function () {
      conn.close();
    });
  }).catch(console.warn);
}

module.exports = producer();