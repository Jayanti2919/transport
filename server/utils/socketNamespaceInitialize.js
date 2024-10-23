const redisClient = require('./redisConnection');
const Driver = require("../models/driver.model");
const { EventEmitter } = require("events");

let driverNamespace;
let customerNamespace;
const eventEmitter = new EventEmitter();
const AVAILABLE_DRIVERS_KEY = "availableDrivers";

function initializeNamespaces(io) {
  driverNamespace = io.of("/drivers");
  customerNamespace = io.of("/customers");

  eventEmitter.on("sendTripRequest", (possibleDrivers, tripDetails) => {
    console.log("Sending trip request to drivers:", possibleDrivers);
    possibleDrivers.forEach((socketId) => {
      console.log(`Emitting tripRequest to driver with socketId: ${socketId}`);
      console.log("Trip details:", tripDetails);
      driverNamespace.to(socketId).emit("tripRequest", tripDetails);
    });
  });

  // Handle driver connections
  driverNamespace.on("connection", (socket) => {
    console.log("Driver connected:", socket.id);

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
        redisClient.hDel(
          driverKey,
          ["driverId", "lat", "lng"],
          (err, reply) => {
            if (err) {
              console.error("Error deleting driver location from Redis:", err);
            } else {
              console.log("Driver location deleted from Redis:", reply);
            }
          }
        );
      }
    });
  });

  customerNamespace.on("connection", (socket) => {
    console.log("Customer connected:", socket.id);

    socket.on("requestDriverLocation", (driverId) => {
      console.log("Customer requested driver location");

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
}

module.exports = {
  initializeNamespaces,
  get driverNamespace() {
    return driverNamespace;
  },
  get customerNamespace() {
    return customerNamespace;
  },
  get eventEmitter() {
    return eventEmitter;
  }
};
