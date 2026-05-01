const jobQueue = require("../queues/jobQueue");

exports.processFile = async (req, res) => {
  try {
    const job = await jobQueue.add("process", {
      fileBuffer: req.file.buffer,
      filename: req.file.originalname
    });

    res.json({
      jobId: job.id,
      status: "queued"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};