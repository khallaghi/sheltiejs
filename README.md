# Sheltie

Sheltie is a kubernetes client which receive commands within a message broker and run them.
you can easily create and delete Pods and Jobs just by send a message via RabbitMQ.

Just store yaml files you want to run them in production and add directory path in ```directory_root``` in config file.
you can specify ```commands``` and ```args``` of yaml files in messages.

## Installation
* Install [RabbitMQ](https://www.rabbitmq.com/download.html) on your system.
* Install [nodejs](https://nodejs.org/en/download/) on your system.
* Download source code.
* Change root directory of your yaml files by changing ```ROOT_DIR``` attribute in [config file](config/config.json)
* Change all attributes under ```MQ_CONFIG``` with appropreate configs of your RabbitMQ in [config file](config/config.json).
* Run ```node sheltie.js```

## Message Formats
Sheltie has a simple message format for example to
## License
[MIT](LICENSE)
