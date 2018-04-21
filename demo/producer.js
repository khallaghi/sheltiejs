const amqp = require('amqplib');
const rabbitmqConfig = require('../config/rabbitmq');
function producer(message) {
  amqp.connect('amqp://' + rabbitmqConfig.host).then(function (conn) {
    return conn.createChannel().then(function (ch) {
      var ex = rabbitmqConfig.exchange.consumer;
      var ok = ch.assertExchange(ex, rabbitmqConfig.exchange_type, {durable: false})
      return ok.then(function () {
        ch.publish(ex, rabbitmqConfig.queue.consumer, Buffer.from(message));
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

