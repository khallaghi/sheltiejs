const amqp = require('amqplib');
function producer(message) {
  amqp.connect('amqp://localhost').then(function (conn) {
    return conn.createChannel().then(function (ch) {
      let ex = 'kuberesponse';
      let ok = ch.assertExchange(ex, 'fanout', {durable: false});
      return ok.then(function () {
        ch.publish(ex, '_response', Buffer.from(message));
        console.log(" [x] Sent '%s'", message);
        return ch.close();
      });
    }).finally(function () {
      conn.close();
    });
  }).catch(console.warn);
}
module.exports = producer;

