const amqp = require('amqplib');
const mqConfig = require('../config/rabbitmq');


function consumer(callback) {
  let connectionObj = {};
  connectionObj.hostname = process.env.MQ_HOST || mqConfig.host;
  connectionObj.port = process.env.MQ_PORT || mqConfig.port;
  connectionObj.vhost = process.env.MQ_VHOST || mqConfig.vhost;
  connectionObj.username = process.env.MQ_USERNAME || mqConfig.user;
  connectionObj.password = process.env.MQ_PASSWORD || mqConfig.pass;

  const exchange = process.env.EXCHANGE_NAME || mqConfig.exchange.consumer;
  const queue = process.env.QUEUE_NAME || mqConfig.queue.consumer;

  amqp.connect(connectionObj).then(function (conn) {
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
