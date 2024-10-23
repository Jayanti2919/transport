const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const proxyServer = require("./proxy/proxy_server");
const Trip = require("./models/trip.model");
const Customer = require("./models/customer.model");
const Driver = require("./models/driver.model");
const Admin = require("./models/admin.model");
const connect = require("./utils/mongoConnection");
const driverAuthRouter = require("./auth/driverAuth");
const driverRouter = require("./api/driver");
const userAuthRouter = require('./auth/customerAuth');
const userRouter = require('./api/user');
const redisClient = require('./utils/redisConnection');
const { initializeNamespaces } = require("./utils/socketNamespaceInitialize");

const app = express();
app.use(cors({
  origin: "*"
}));
app.use(express.json());

app.use("/proxy", proxyServer);
app.use("/driver", driverAuthRouter);
app.use("/user", userAuthRouter);
app.use("/driver/api", driverRouter);
app.use("/user/api", userRouter);

// HTTP server and Socket.io server
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

initializeNamespaces(io);

module.exports = { server };

const PORT = 5000;
server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  connect();
  await redisClient.connect();
  console.log("Connected to Redis");
});
