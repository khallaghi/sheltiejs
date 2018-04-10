const k8s_client = require('./k8s/client');
const yaml = require('yamljs');
const config = require('./config/config');
const InputMessage = require('./models/input_message');
const consumer = require('./message_broker/consumer');

function callback(rawMessage) {
  console.log('[X] %s' ,rawMessage.content.toString());
  let inputMessage = new InputMessage(rawMessage.content.toString());
  let deploymentObj = yaml.load(config.DEFAULT.ROOT_DIR + inputMessage.filename);
	console.log('YAML:');
	console.log(deploymentObj);
  k8s_client.handleObj(deploymentObj, inputMessage.namespace);
}
function print(message) {
	console.log(message.content.toString());


}

consumer(callback);
/*
python sender.py '{"file_name": "video-thumbnail.yaml", "kind":"job", "command":"create", "namespace":"default", "id": "7", "args": [{"command": ["/bin/bash", "-c"], "args": ["bash /CORE/video/script2/video-thumbnail.sh -z 0 -t 00:00:10 -o /CORE/proxy/all/vod2/www/files/ahmadreza.khattokhat.com/0ea8c195-81df-4ccf-b130-3dd01ef0c76a/hd.mp4 -s /CORE/proxy/all/vod2/www/files/ahmadreza.khattokhat.com/0ea8c195-81df-4ccf-b130-3dd01ef0c76a/thumbnail.json -d /CORE/proxy/all/vod2/www/files/ahmadreza.khattokhat.com/0ea8c195-81df-4ccf-b130-3dd01ef0c76a/thumbnail.png -e /CORE/proxy/all/vod2/www/files/ahmadreza.khattokhat.com/0ea8c195-81df-4ccf-b130-3dd01ef0c76a/tooltip.png"]}]}'
 */
