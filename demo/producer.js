const amqp = require('amqplib');
function producer(message) {
  amqp.connect('amqp://localhost').then(function (conn) {
    return conn.createChannel().then(function (ch) {
      var ex = 'kubecommand';
      var ok = ch.assertExchange(ex, 'fanout', {durable: false})
      return ok.then(function () {
        ch.publish(ex, '_command', Buffer.from(message));
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


/*

sample command


node producer.js '{"name": "video-ftp", "action":"create", "namespace":"default", "id": "7", "args":
[
{
    "key": "z",
    "value": "0"
},
{
    "key": "t",
    "value": "00:00:10"
},
{
    "key": "o",
    "value": "/CORE/proxy/all/vod2/www/files/ahmadreza.khattokhat.com/0ea8c195-81df-4ccf-b130-3dd01ef0c76a/hd.mp4"
},
{
    "key": "s",
    "value": "/CORE/proxy/all/vod2/www/files/ahmadreza.khattokhat.com/0ea8c195-81df-4ccf-b130-3dd01ef0c76a/thumbnail.json"
},
{
    "key": "d",
    "value": "/CORE/proxy/all/vod2/www/files/ahmadreza.khattokhat.com/0ea8c195-81df-4ccf-b130-3dd01ef0c76a/thumbnail.json"
},
{
    "key": "e",
    "value": "/CORE/proxy/all/vod2/www/files/ahmadreza.khattokhat.com/0ea8c195-81df-4ccf-b130-3dd01ef0c76a/tooltip.png"
}
]
}'
*/
