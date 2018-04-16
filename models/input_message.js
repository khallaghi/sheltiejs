module.exports = class InputMessage {
  constructor(jsonStr) {
	  let rawJson = JSON.parse(jsonStr);
	  console.log(rawJson);
    this.filename = rawJson['file_name'];
    this.type = rawJson['type'];
    this.command = rawJson['command'];
    this.namespace = rawJson['namespace'] | 'default';
    this.name = rawJson['name'];
    this.args = rawJson['args'];
    this.id = rawJson['id'];
    this.args = rawJson['args'];
  }
};
