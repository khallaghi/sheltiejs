const Client = require('kubernetes-client').Client;
const config = require('kubernetes-client').config;
const defaultConfig = require('../config/default.json');
const _ = require('lodash');

let client;
if (defaultConfig['K8S_CONFIG'] === 'GET_IN_CLUSTER') {
	console.log('GET_IN_CLUSTER');
	console.log('GET_IN_CLUSTER');
	console.log(JSON.stringify(config.getInCluster()));
	client = new Client({ config: config.getInCluster(), version: '1.9' });
} //else if(defaultConfig['K8S_CONFIG'] === 'FROM_KUBE_CONFIG') {
//	console.log('FROM_KUBE_CONFIG');
//	console.log('FROM_KUBE_CONFIG');
//	client = new Client({ config: config.fromKubeconfig(), version: '1.9' });
//}

const functions =  {
  async handleObj(kind, action, name, namespace, manifest) {
//    if (_.isEqual(_.toLower(kind), 'job')) {
//      if (_.isEqual(action, 'create')) {
        await functions.createJob(manifest, namespace);
//      } else if (_.isEqual(action, 'delete')) {
//        await functions.deleteJob(name, namespace);
//      }
//    } else if (_.isEqual(kind, 'deployment')) {
//      if (_.isEqual(action, 'create')) {
//         await functions.createDeployment(manifest, namespace);
//      } else if (_.isEqual(action, 'delete')) {
//        await functions.deleteDeployment(name, namespace);
//      }
//    } else if (_.isEqual(kind, 'pod')) {
//      if (_.isEqual(action, 'create')) {
//         await functions.createPod(manifest, namespace);
//      } else if (_.isEqual(action, 'delete')) {
//        await functions.deletePod(name, namespace);
//      }
//    }
  },

  async createJob(manifest, namespace) {
    namespace = namespace || 'default';
    try {
      const create = await client.apis.batch.v1.namespaces(namespace).jobs.post({body: manifest});
	    console.log(create)
    } catch (err) {
	    console.log('ERROR');
      console.log(err.message);
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
