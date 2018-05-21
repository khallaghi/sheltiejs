const amqp = require('amqplib');
const mqConfig = require('../config/rabbitmq');

let connectionObj = {};
connectionObj.hostname = process.env.MQ_HOST || mqConfig.host;
connectionObj.port = process.env.MQ_PORT || mqConfig.port;
connectionObj.vhost = process.env.MQ_VHOST || mqConfig.vhost;
connectionObj.username = process.env.MQ_USERNAME || mqConfig.user;
connectionObj.password = process.env.MQ_PASSWORD || mqConfig.pass;

function producer(message) {

  amqp.connect(connectionObj).then(function (conn) {
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

