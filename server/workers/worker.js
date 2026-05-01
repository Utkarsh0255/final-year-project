const { Worker } = require("bullmq");
const IORedis = require("ioredis");
const processWithPython = require("../services/pythonService");

const connection = new IORedis();
const pub = new IORedis();

const worker = new Worker(
  "data-processing",
  async job => {
    const { fileBuffer, filename } = job.data;

    // Step 1
    await pub.publish("job-progress", JSON.stringify({
      jobId: job.id,
      stage: "starting",
      progress: 10
    }));

    const result = await processWithPython(fileBuffer, filename, job.id);

    // Step 2
    await pub.publish("job-progress", JSON.stringify({
      jobId: job.id,
      stage: "completed",
      progress: 100
    }));

    return result;
  },
  { connection }
);