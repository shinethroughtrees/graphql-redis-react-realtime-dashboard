const pubsub = require('./pubsub');
const {
    cpuData,
    regionData,
    messageData,
    trafficData
} = require('./utils/generator');
const { get, set } = require('./utils/redis');
const COMPONENTS = {
    CPU: 'cpu',
    TRAFFIC: 'traffic',
    DISTRIBUTION: 'distribution',
    MESSAGE: 'message'
};

/**
 * 
 * @param {function} generator - corresponding data genrator function for 'component'   
 * @param {string} component 
 */
const publishRandomData = async (generator, component) => {
    const data = generator();
    pubsub.publish(component, { [component]: data });
    await set(component, data);
    return data;
};
module.exports = {
    Query: {
        cpu: () => get(COMPONENTS.CPU)
    },
    Mutation: {
        cpu: () => publishRandomData(cpuData, COMPONENTS.CPU),
        traffic: () => publishRandomData(trafficData, COMPONENTS.TRAFFIC)
    },
    Subscription: {
        cpu: {
            subscribe: () => pubsub.asyncIterator(COMPONENTS.CPU)
        },
        traffic: {
            subscribe: () => pubsub.asyncIterator(COMPONENTS.TRAFFIC)
        }
    }
}