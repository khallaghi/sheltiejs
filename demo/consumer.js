const amqp = require('amqplib');
const rabbitmqConfig = require('../config/rabbitmq');
function consumer(callback) {
  amqp.connect('amqp://' + rabbitmqConfig.host).then(function (conn) {
    process.once('SIGINT', function () {
      conn.close();
    });
    return conn.createChannel().then(function (ch) {
      var ok = ch.assertExchange(rabbitmqConfig.exchange.producer, rabbitmqConfig.exchange_type, {durable: false});
      ok = ok.then(function () {
        return ch.assertQueue(rabbitmqConfig.queue.producer, {exclusive: true});
      });
      ok = ok.then(function (qok) {
        return ch.bindQueue(qok.queue, rabbitmqConfig.exchange.producer, rabbitmqConfig.queue.producer).then(function () {
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
function callback(message){
	console.log(' [x] received message');
	console.log(message.content.toString());
}
consumer(callback);
