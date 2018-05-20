const k8s_client = require('./k8s/client');
const yaml = require('yamljs');
const defaultConfig = require('./config/default');
const InputMessage = require('./models/input_message');
const consumer = require('./message_broker/consumer');
const producer = require('./message_broker/producer');
const utils = require('./utils');
const _ = require('lodash');
const logger = require('./logger');

async function callback(rawMessage) {
  console.log('RAW MESSAGE');
	logger.info(rawMessage.content.toString());
	let _id;
  try {
	_id = JSON.parse(rawMessage.content.toString())['id'];
	const rootDirectory = process.env.ROOT_DIR || defaultConfig.rootDirectory;
	if (_.isUndefined(_id)) return;
  	let inputMessage = new InputMessage(rawMessage.content.toString());
    logger.info('[X] %s', rawMessage.content.toString());
    let deploymentObj = yaml.load(rootDirectory + inputMessage.name + defaultConfig.deploymentFileExtension);
    if (_.isNull(deploymentObj)) return;
    const deploymentInfo = {
      kind:  defaultConfig.kind,
      action: inputMessage.action || defaultConfig.action,
      namespace: inputMessage.namespace || defaultConfig.namespace,
      name: inputMessage.name
    };
    deploymentObj = utils.addArgsToManifest(deploymentObj, inputMessage.args);
    deploymentObj = utils.manipulateName(deploymentObj, _id);
    logger.info(JSON.stringify(deploymentObj));
    await k8s_client.handleObj(deploymentInfo, deploymentObj);
    let message = {
      id: _id,
      status: 0,
      message: ''
    };
    logger.info(JSON.stringify(message));
  } catch (err) {
		if (!_.isNumber(err.statusCode)) err.statusCode = 1;
    let message = {
      id: _id,
      status: err.statusCode,
      message: err.message
    };
    logger.error(JSON.stringify(message));
  }
}

consumer(callback);
/*
python sender.py '{"file_name": "video-thumbnail.yaml", "kind":"job", "command":"create", "namespace":"default", "id": "7", "args": [{"command": ["/bin/bash", "-c"], "args": ["bash /CORE/video/script2/video-thumbnail.sh -z 0 -t 00:00:10 -o /CORE/proxy/all/vod2/www/files/ahmadreza.khattokhat.com/0ea8c195-81df-4ccf-b130-3dd01ef0c76a/hd.mp4 -s /CORE/proxy/all/vod2/www/files/ahmadreza.khattokhat.com/0ea8c195-81df-4ccf-b130-3dd01ef0c76a/thumbnail.json -d /CORE/proxy/all/vod2/www/files/ahmadreza.khattokhat.com/0ea8c195-81df-4ccf-b130-3dd01ef0c76a/thumbnail.png -e /CORE/proxy/all/vod2/www/files/ahmadreza.khattokhat.com/0ea8c195-81df-4ccf-b130-3dd01ef0c76a/tooltip.png"]}]}'
 */
