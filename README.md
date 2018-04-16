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

## Input Message Structure
Sheltie accepts input messages in below structure:
```
{
  "id": "ID",
  "version": "VERSION",
  "name": "NAME",
  "action": "ACTION",
  "namespace": "NAMESPACE",
  "authtoken": "AUTH_TOKEN",
  "args": [
    {
      "key": "KEY",
      "value": "VALUE"
    }
  ]
}
```


* ```id``` Genrated id by sender that Sheltie send back response message with this id.
* ```version``` Version of message. Currently Sheltie only accepts messages with version 1.
* ```name``` Name of a action.
* ```action``` acceptable values `create`, `delete`.
* ```namespace```
* ```authtoken``` Authentication token for security.
* ```args``` List of arguments to run in job for each job you could see in jobs documents.
each objects of `args` list is like
```
{
    "key": "KEY",
    "value": "VALUE"
}
```

## Response Message
```
{
    "id": "ID",
    "status": "OK",
    "message": "MESSAGE"
}
```

* `id` The same id of input message.
* `status` status of response 0 for successful and any none zero number for failure.
* `message` in successful response this field will be null and in failure it contains error message.

## Message Formats
Sheltie has a simple message format for example to
## License
[MIT](LICENSE)
