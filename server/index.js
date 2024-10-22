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
const userAuthRouter = require('./auth/customerAuth');
const userRouter = require('./api/user');

const app = express();
app.use(cors());
app.use(express.json());

app.use("/proxy", proxyServer);
app.use("/driver", driverAuthRouter);
app.use("/user", userAuthRouter);
app.use("/driver/api", driverRouter);
app.use("/user/api", userRouter);

// HTTP server and Socket.io server
const server = http.createServer(app);
module.exports = { server };
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

// Create a namespace for drivers
const driverNamespace = io.of("/drivers");
const customerNamespace = io.of("/customers");

// Handle multiple driver connections
driverNamespace.on("connection", (socket) => {
  console.log("Driver connected:", socket.id);

  // Handle driver going online and sharing location
  socket.on("driverOnline", async (location) => {
    console.log("Driver online, location:", location);
    try {
      if (location.driverId) {
        const filter = { _id: location.driverId };
        const update = {
          socketId: socket.id,
          status: "available",
          location: { lat: location.lat, lng: location.lng },
        };
        const updatedDriver = await Driver.findOneAndUpdate(filter, update);
        console.log("Updated socket:", updatedDriver.socketId);
      }

      redisClient.sAdd(AVAILABLE_DRIVERS_KEY, socket.id);

      // Store driver location in Redis
      await redisClient.hSet(`driverLocation:${socket.id}`, {
        driverId: location.driverId,
        lat: location.lat,
        lng: location.lng,
      });
      console.log("Driver location stored successfully:", location);
    } catch (err) {
      console.error("Error processing driverOnline event:", err);
    }
  });

  // Handle driver location updates
  socket.on("driverLocationUpdate", (locationData) => {
    console.log("Driver location update received:", locationData);
    const driverKey = `driverLocation:${socket.id}`;
    redisClient.hSet(
      driverKey,
      {
        driverId: locationData.driverId,
        lat: locationData.lat,
        lng: locationData.lng,
      },
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
  });

  // Handle driver going offline
  socket.on("driverOffline", async (location) => {
    if (redisClient.EXISTS(socket.id)) {
      redisClient.sRem(AVAILABLE_DRIVERS_KEY, socket.id);
    }
    const filter = { _id: location.driverId };
    const update = {
      status: "offline",
      socketId: "",
      location: { lat: location.lat, lng: location.lng },
    };
    const updatedDriver = await Driver.findOneAndUpdate(filter, update);
    const driverKey = `driverLocation:${socket.id}`;
    redisClient.hDel(driverKey, ["driverId", "lat", "lng"], (err, reply) => {
      if (err) {
        console.error("Error deleting driver location from Redis:", err);
      } else {
        console.log("Driver location deleted from Redis:", reply);
      }
    });
    console.log("Updated socket:", updatedDriver.socketId);
  });

  // Handle driver disconnection
  socket.on("disconnect", async () => {
    console.log("Driver disconnected:", socket.id);
    const filter = { socketId: socket.id };
    const currDriver = await Driver.findOne(filter);
    if (currDriver) {
      const update = {
        status: "offline",
        socketId: "",
      };
      const updatedDriver = await Driver.findOneAndUpdate(filter, update);
      const driverKey = `driverLocation:${socket.id}`;
      redisClient.hDel(driverKey, ["driverId", "lat", "lng"], (err, reply) => {
        if (err) {
          console.error("Error deleting driver location from Redis:", err);
        } else {
          console.log("Driver location deleted from Redis:", reply);
        }
      });
    }
  });
});

// Handle multiple customer connections
customerNamespace.on("connection", (socket) => {
  console.log("Customer connected:", socket.id);

  // Customer requests driver locations
  socket.on("requestDriverLocation", (driverId) => {
    console.log("Customer requested driver location");

    // Fetch and broadcast driver locations from Redis
    redisClient.keys("driverLocation:*", async (err, keys) => {
      if (err) {
        console.error("Error fetching driver locations from Redis:", err);
        return;
      }
      for (let key of keys) {
        const locationData = await redisClient.hGetAll(key);

        socket.emit("broadcastDriverLocation", locationData);
      }
    });
  });

  // Handle customer disconnection
  socket.on("disconnect", () => {
    console.log("Customer disconnected:", socket.id);
  });
});

const PORT = 5000;
server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  connect();
  await redisClient.connect();
  console.log("Connected to Redis");
});
