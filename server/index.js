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
const redis = require("redis");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/proxy", proxyServer);
app.use("/driver", driverAuthRouter);
app.use("/api", driverRouter);

// HTTP server and Socket.io server
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const redisClient = redis.createClient();

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

const AVAILABLE_DRIVERS_KEY = "availableDrivers";

// Socket connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("driverOnline", (location) => {
    console.log("Driver online, location:", location);
    redisClient.sAdd(AVAILABLE_DRIVERS_KEY, socket.id, (err, reply) => {
      if (err) {
        console.error("Error adding driver to Redis:", err);
      }
    });
    console.log(location);
    redisClient.hSet(
      `driverLocation:${socket.id}`,
      {"driverId": location.driverId,
      "lat": location.lat,
      "lng": location.lng,},
      (err, reply) => {
        if (err) {
          console.error("Error storing driver location in Redis:", err);
        } else {
          console.log(reply);
        }
      }
    );
  });

  socket.on("driverLocationUpdate", (locationData) => {
    console.log("Driver location received:", locationData);
    const driverKey = `driverLocation:${socket.id}`;
    redisClient.hSet(
      driverKey,
      {"driverId": locationData.driverId,
      "lat": locationData.lat,
      "lng": locationData.lng,},
      (err, reply) => {
        if (err) {
          console.error("Error updating driver location in Redis:", err);
        } else {
          console.log(
            `Driver location updated in Redis for ${driverKey}: ${locationData.lat}, ${locationData.lng}, ${reply}`
          );
        }
      }
    );
    io.emit("broadcastDriverLocation", locationData);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = 5000;
server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  connect();
  await redisClient.connect();
  console.log("Connected to Redis");
});
