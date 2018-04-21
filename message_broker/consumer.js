const amqp = require('amqplib');
const mqConfig = require('../config/rabbitmq');


function consumer(callback) {
  const host = process.env.MQ_HOST || mqConfig.host;
  const exchange = process.env.EXCHANGE_NAME || mqConfig.exchange.consumer;
  const queue = process.env.QUEUE_NAME || mqConfig.queue.consumer;
  const port = process.env.MQ_HOST || mqConfig.port;
  const vhost = process.env.MQ_VHOST || mqConfig.vhost;
  const username = process.env.MQ_USERNAME || mqConfig.user;
  const password = process.env.MQ_PASSWORD || mqConfig.pass;

  amqp.connect('amqp://' + host).then(function (conn) {
    process.once('SIGINT', function () {
      conn.close();
    });
    return conn.createChannel().then(function (ch) {
      const exchange_type = process.env.EXCHANGE_TYPE || mqConfig.exchange_type;
      let ok = ch.assertExchange(exchange, exchange_type, {durable: false});
      ok = ok.then(function () {
        return ch.assertQueue(queue, {exclusive: true});
      });
      ok = ok.then(function (qok) {
        return ch.bindQueue(qok.queue, exchange, queue).then(function () {
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
