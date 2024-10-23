const redisClient = require("./redisConnection");
const Driver = require("../models/driver.model");
const Customer = require("../models/customer.model");
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

  eventEmitter.on("tripAccepted", (tripDetails, socketId) => {
    console.log("Trip accepted by driver:", tripDetails);
    customerNamespace
      .to(socketId)
      .emit("tripAccepted", tripDetails);
  });

  eventEmitter.on("tripEnded", (tripDetails, socketId) => {
    customerNamespace
      .to(socketId)
      .emit("tripEnded", tripDetails);
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

        redisClient.sAdd(AVAILABLE_DRIVERS_KEY, location.driverId);

        await redisClient.hSet(`driverLocation:${location.driverId}`, {
          socket: socket.id,
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
      const driverKey = `driverLocation:${locationData.driverId}`;
      redisClient.hSet(
        driverKey,
        {
          socket: socket.id,
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
      if (redisClient.EXISTS(location.driverId)) {
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
    socket.on("requestDriverLocation", async (driverId) => {
      console.log("Received request for driver location for driver:", driverId);
      const locationData = await redisClient.hGetAll(
        `driverLocation:${driverId}`
      );
      if (locationData) {
        customerNamespace
          .to(socket.id)
          .emit("broadcastDriverLocation", locationData);
      } else {
        return;
      }
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
  },
};
