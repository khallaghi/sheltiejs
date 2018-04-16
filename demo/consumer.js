const amqp = require('amqplib');
function consumer(callback) {
  amqp.connect('amqp://localhost').then(function (conn) {
    process.once('SIGINT', function () {
      conn.close();
    });
    return conn.createChannel().then(function (ch) {
      var ok = ch.assertExchange('kubeclient', 'fanout', {durable: false});
      ok = ok.then(function () {
        return ch.assertQueue('_response', {exclusive: true});
      });
      ok = ok.then(function (qok) {
        return ch.bindQueue(qok.queue, 'kubeclient', '_response').then(function () {
          return qok.queue;
        });
      });
      ok = ok.then(function (queue) {
        return ch.consume(queue, callback, {noAck: true});
      });
      return ok.then(function () {
        console.log(' [*] Waiting for logs. To exit press CTRL+C');
      });
    });

  }).catch(console.warn);

}
module.exports = consumer;
