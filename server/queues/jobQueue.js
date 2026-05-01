const { Queue } = require("bullmq");
const IORedis = require("ioredis");

const connection = new IORedis();

const jobQueue = new Queue("data-processing", { connection });

module.exports = jobQueue;