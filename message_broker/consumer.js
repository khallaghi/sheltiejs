const amqp = require('amqplib');
const mqConfig = require('../config/rabbitmq');


function consumer(callback) {
  amqp.connect('amqp://' + mqConfig.host).then(function (conn) {
    process.once('SIGINT', function () {
      conn.close();
    });
    return conn.createChannel().then(function (ch) {
      var ok = ch.assertExchange(mqConfig.exchange.consumer, mqConfig.exchange_type, {durable: false});
      ok = ok.then(function () {
        return ch.assertQueue(mqConfig.queue.consumer, {exclusive: true});
      });
      ok = ok.then(function (qok) {
        return ch.bindQueue(qok.queue, mqConfig.exchange.consumer, mqConfig.queue.consumer).then(function () {
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
