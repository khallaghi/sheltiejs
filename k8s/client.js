const Client = require('kubernetes-client').Client;
const config = require('kubernetes-client').config;
const client = new Client({ config: config.fromKubeconfig(), version: '1.9' });

const functions =  {
  async handleObj (type, command, name, namespace, manifest) {
    if (type === 'job') {
      if (command === 'create') {
        await functions.createJob(manifest, namespace);
      } else if (command === 'delete') {
        await functions.deleteJob(name, namespace);
      }
    } else if (type === 'deployment') {
      if (command === 'create') {
         await functions.createDeployment(manifest, namespace);
      } else if (command === 'delete') {
        await functions.deleteDeployment(name, namespace);
      }
    } else if (type === 'pods') {
      if (command === 'create') {
         await functions.createPod(manifest, namespace);
      } else if (command === 'delete') {
        await functions.deletePod(name, namespace);
      }
    }
  },

  async createJob(manifest, namespace) {
    namespace = namespace || 'default';
    try {
      const create = await client.apis.batch.v1.namespaces(namespace).jobs.post({body: manifest});
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  async deleteJob(name, namespace)  {
    try {
      await client.apis.batch.v1.namespaces(namespace).jobs(name).delete();
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  async createDeployment (manifest, namespace) {
   try {
     await client.apis.apps.v1.namespaces(namespace).deployments.post({body: manifest});
   } catch (err) {
     console.log(err);
     throw err;
   }
  },

  async deleteDeployment (name, namespace) {
    try {
     await client.apis.apps.v1.namespaces(namespace).deployments(name).delete();
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  async createPod (manifest, namespace) {
   try {
     await client.apis.v1.namespaces(namespace).pods.post({body: manifest});
   } catch (err) {
     console.log(err);
     throw err;
   }
  },

  async deletePod (name, namespace) {
    try {
     await client.apis.v1.namespaces(namespace).pods(name).delete();
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};

module.exports = functions;
