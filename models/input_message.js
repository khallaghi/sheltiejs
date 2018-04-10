module.exports = class InputMessage {
  constructor(jsonStr) {
	  let rawJson = JSON.parse(jsonStr);
    this.filename = rawJson['file_name'];
    this.kind = rawJson['kind'];
    this.command = rawJson['create'];
    this.namespace = rawJson['namespace'] | 'default';
    this.id = rawJson['id'];
    this.args = rawJson['args'];
  }
};
