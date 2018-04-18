const _  = require('lodash');
module.exports = class InputMessage {
  constructor(jsonStr) {
	  let rawJson = JSON.parse(jsonStr);
	  console.log(rawJson);
		let properties = ['name', 'action', 'id', 'args'];
		for (let property of properties){
			if(_.isEqual(rawJson[property], '')){
				let err = new Error(`property ${property} missed.`); 
				err.statusCode = 400;
				throw err;
			}
		}
    this.id = rawJson['id'];
    this.name = rawJson['name'];
    this.action= rawJson['action'];
    this.namespace = rawJson['namespace'] ;
    this.authToken = rawJson['authtoken'];
    this.args = rawJson['args'];
  }
};
