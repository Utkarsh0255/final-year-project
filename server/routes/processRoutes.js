const express = require("express");
const multer = require("multer");
const { processFile } = require("../controllers/processController");
const { Queue } = require("bullmq");
const IORedis = require("ioredis");

const router = express.Router();
const upload = multer();

const connection = new IORedis();
const queue = new Queue("data-processing", { connection });

router.post("/process", upload.single("file"), processFile);

router.get("/status/:id", async (req, res) => {
  const job = await queue.getJob(req.params.id);

  if (!job) return res.json({ status: "not_found" });

  const state = await job.getState();

  if (state === "completed") {
    return res.json({
      status: "completed",
      result: job.returnvalue
    });
  }

  res.json({ status: state });
});

module.exports = router;