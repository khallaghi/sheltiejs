module.exports = class InputMessage {
  constructor(jsonStr) {
	  let rawJson = JSON.parse(jsonStr);
	  console.log(rawJson);
    this.name = rawJson['name'];
    this.action= rawJson['action'];
    this.namespace = rawJson['namespace'] | 'default';
    this.args = rawJson['args'];
    this.id = rawJson['id'];
  }
};
