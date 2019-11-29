const schedule = require('node-schedule');
const request = require('request-promise');

const queries = {
  CPU: `
    mutation {
      cpu {
        percentage
      }
    }
  `,
  TRAFFIC: `
    mutation {
      total
      dps {
        timestamp
        value
      }
    }
  `,
  DISTRIBUTION: `
    mutation {
      distribution {
        region
        percentage
      }
    }
  `,
  MESSAGES: `
    mutation {
      messages {
        title
        description
        color
      }
    }
  `
};

const makeHttpRequest = async component => {
  const options = {
    uri: "http://localhost:4000",
    method: "POST",
    json: true,
    body: {
      operationName: null,
      variables: {},
      query: queries[component]
    }
  };
  await request(options);
};

const start = async () => {
  console.log("Starting worker");
  const s1 = schedule.scheduleJob("*/3 * * * * *", async () => {
    await makeHttpRequest("CPU");
    console.log("Fetched new results for CPU");
  });

  const s2 = schedule.scheduleJob("*/5 * * * * *", async () => {
    await makeHttpRequest("TRAFFIC");
    console.log("Fetched now results for TRAFFIC");
  });
  const s3 = schedule.scheduleJob("*/4 * * * * *", async () => {
    await makeHttpRequest("DISTRIBUTION");
    console.log("Fetched new results for DISTRIBUTION");
  });
  const s4 = schedule.scheduleJob("*/3 * * * * *", async () => {
    await makeHttpRequest("MESSAGES");
    console.log("Fetched new results for MESSAGES");
  });
  console.log("Scheduled Jobs for CPU, Traffic, distribution, messages");
 };
 
 start();

  