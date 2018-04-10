const Client = require('kubernetes-client').Client;
const config = require('kubernetes-client').config;
const client = new Client({ config: config.fromKubeconfig(), version: '1.9' });

module.exports = {
  async handleObj (deploymentManifest, namespace) {
    try {
      namespace = namespace || 'default';
      const create = await client.apis.apps.v1.namespaces(namespace).deployments.post({ body: deploymentManifest });
      console.log('CREATE');
      console.log(create);
    } catch (err) {
      console.log(err);
    }
  }
};