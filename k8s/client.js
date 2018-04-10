const Client = require('kubernetes-client').Client;
const config = require('kubernetes-client').config;
const client = new Client({ config: config.fromKubeconfig(), version: '1.9' });

module.exports = {
  async handleObj (deploymentManifest, namespace) {
    try {
      namespace = namespace || 'default';
	    console.log(namespace);
	    const job = await client.apis.batch.v1.namespaces(namespace).jobs.get({pretty: true});
	    console.log(JSON.stringify(job, null, 2));
      const create = await client.apis.batch.v1.namespaces(namespace).jobs.post({ body: deploymentManifest });
      console.log('CREATE');
      console.log(JSON.stringify(create, null, 2));
    } catch (err) {
      console.log(err);
    }
  }
};
