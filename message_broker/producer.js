const amqp = require('amqplib');
const mqConfig = require('../config/rabbitmq');


function producer(message) {
  amqp.connect('amqp://' + mqConfig.host).then(function (conn) {
    return conn.createChannel().then(function (ch) {
      let ok = ch.assertExchange(mqConfig.exchange.producer, mqConfig.exchange_type, {durable: false});
      return ok.then(function () {
        ch.publish(mqConfig.exchange.producer, mqConfig.queue.producer, Buffer.from(message));
        console.log(" [x] Sent '%s'", message);
        return ch.close();
      });
    }).finally(function () {
      conn.close();
    });
  }).catch(console.warn);
}
module.exports = producer;

