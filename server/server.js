const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const routes = require("./routes/processRoutes");
const IORedis = require("ioredis");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use("/api", routes);

// Redis subscriber
const sub = new IORedis();

sub.subscribe("job-progress");

sub.on("message", (channel, message) => {
  const data = JSON.parse(message);

  // Emit to specific client room
  io.to(data.jobId).emit("progress", data);
});

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("join-job", (jobId) => {
    socket.join(jobId);
  });
});

server.listen(5000, () => console.log("Server running on 5000"));