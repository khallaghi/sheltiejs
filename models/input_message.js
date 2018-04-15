module.exports = class InputMessage {
  constructor(jsonStr) {
	  let rawJson = JSON.parse(jsonStr);
    this.filename = rawJson['file_name'];
    this.type = rawJson['kind'];
    this.command = rawJson['create'];
    this.namespace = rawJson['namespace'] | 'default';
    this.name = rawJson['name'];
    this.args = rawJson['args'];
    this.id = rawJson['id'];
    this.args = rawJson['args'];
  }
};
