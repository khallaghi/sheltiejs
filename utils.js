const _ = require('lodash');
const scriptConfig = require('./config/script-path');
const defaultConfig = require('./config/default');
module.exports = {
  manipulateName(manifest, id) {
    try {
      let manipulatedName = manifest.metadata.name + defaultConfig.delimiter + id;
      manifest.metadata.name = manipulatedName;
      manifest.spec.template.metadata.name = manipulatedName;
      return manifest;
    }  catch (err) {
      console.log(err);
      throw err;
    }
  },
  addArgsToManifest (manifest, args) {
    try {
      let name = manifest.metadata.name;
      const command = ['/bin/bash', '-c'];
      const commandArgs = generateCommand(name, args);
      manifest.spec.template.spec.containers[0].command = command;
      manifest.spec.template.spec.containers[0].args = [commandArgs];
      return manifest;
    } catch (err) {
      console.log('TYPEERROR');
      throw err;
    }
  }
};
function generateCommand(name, args) {
  let mainCommand = '';
  mainCommand += 'bash ';
  mainCommand += scriptConfig['MAIN_PATH'] + scriptConfig['FILE_NAME'][name]  + ' ';
  for (let arg of args) {
    if (!_.isEqual(arg.key, '')  && !_.isEqual(arg.value, '')){
      mainCommand += '-' + arg.key + ' ' + arg.value + ' ';
    }
  }
  return mainCommand;
}


/* "/bin/bash", "-c"*/
