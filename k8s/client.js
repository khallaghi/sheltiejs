const Client = require('kubernetes-client').Client;
const config = require('kubernetes-client').config;
const defaultConfig = require('../config/default');
const _ = require('lodash');
const logger = require('../logger');

let client;
if (defaultConfig.kubernetesConfigType === 'GET_IN_CLUSTER') {
	client = new Client({ config: config.getInCluster(), version: defaultConfig.apiVersion });
} else if(defaultConfig.kubernetesConfigType === 'FROM_KUBE_CONFIG') {
	client = new Client({ config: config.fromKubeconfig(), version: defaultConfig.apiVersion });
}

const functions =  {
  async handleObj(deploymentInfo, deploymentObj) {

   if (_.isEqual(_.toLower(deploymentInfo.kind), 'job')) {
     if (_.isEqual(deploymentInfo.action, 'create')) {
        await functions.createJob(deploymentObj, deploymentInfo.namespace);
     } else if (_.isEqual(deploymentInfo.action, 'delete')) {
       await functions.deleteJob(deploymentInfo.name, deploymentInfo.namespace);
     }
   } else if (_.isEqual(deploymentInfo.kind, 'deployment')) {
     if (_.isEqual(deploymentInfo.action, 'create')) {
        await functions.createDeployment(deploymentObj, deploymentInfo.namespace);
     } else if (_.isEqual(deploymentInfo.action, 'delete')) {
       await functions.deleteDeployment(deploymentInfo.name, deploymentInfo.namespace);
     }
   } else if (_.isEqual(deploymentInfo.kind, 'pod')) {
     if (_.isEqual(deploymentInfo.action, 'create')) {
        await functions.createPod(deploymentObj, deploymentInfo.namespace);
     } else if (_.isEqual(deploymentInfo.action, 'delete')) {
       await functions.deletePod(deploymentInfo.name, deploymentInfo.namespace);
     }
   }
  },

  async createJob(manifest, namespace) {
    try {
      const create = await client.apis.batch.v1.namespaces(namespace).jobs.post({body: manifest});
	    console.log(create)
    } catch (err) {
      logger.error()
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
