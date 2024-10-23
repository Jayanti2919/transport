const express = require("express");
const Driver = require("../models/driver.model");
const User = require("../models/customer.model");
const TripDetails = require("../models/trip.model");
const { server } = require("../index");
const redisClient = require("../utils/redisConnection");
const { eventEmitter } = require("../utils/socketNamespaceInitialize");
const io = require("socket.io")(server);

const router = new express.Router();

router.route("/fetchUserDetails").get(async (req, res) => {
  const user_id = req.headers["user_id"];
  var user = await User.findOne({ _id: user_id });
  if (!user) {
    res.status(500).json({ message: "Could not find user" });
    return;
  }
  if (user.trip_history.length > 0) {
    var lastTrip = user.trip_history[user.trip_history.length - 1];
    var trip = TripDetails.findOne({ _id: lastTrip._id });
    if (!trip) {
      res.status(200).json({ user: user, lastTrip: null });
    } else {
      if (trip.status === "in-transit") {
        res.status(200).json({ user: user, lastTrip: trip });
      } else {
        res.status(200).json({ user: user, lastTrip: null });
      }
    }
  }
  res.status(200).json({ user: user, lastTrip: null });
});

function haversineDistance(lat1, lng1, lat2, lng2) {
  const toRadians = (degrees) => degrees * (Math.PI / 180);

  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;
  return distance;
}

router.route("/requestTrip").post(async (req, res) => {
  const body = req.body;
  let possibleDrivers = [];
  const availableDriverIds = await redisClient.sMembers("availableDrivers");
  if (availableDriverIds.length > 0) {
    for (const driverId of availableDriverIds) {
      const key = `driverLocation:${driverId}`;

      let driver = await Driver.findOne({ _id: driverId });
      if (driver) {
        if (
          driver.country === body.country &&
          driver.vehicle_type === body.vehicleType
        ) {
          let driverLat = await redisClient.hGet(key, "lat");
          let driverLng = await redisClient.hGet(key, "lng");

          if (driverLat && driverLng) {
            let distance = haversineDistance(
              driverLat,
              driverLng,
              body.source.lat,
              body.source.lng
            );

            if (distance <= 5) {
              let socket = await redisClient.hGet(key, "socket");
              possibleDrivers.push(socket);
            }
          }
        }
      }
    }
  }
  console.log(possibleDrivers);
  if (possibleDrivers.length > 0) {
    // Emit trip request to all possible drivers
    console.log("Sending call to evenEmitter");
    eventEmitter.emit("sendTripRequest", possibleDrivers, {
      customerId: body.customerId,
      source: body.source,
      destination: body.destination,
      amount: body.estimatedAmount,
      formattedSource: body.formattedSource,
      formattedDestination: body.formattedDestination,
      customerSocket: body.socketId,
    });
    res.status(200).json({ message: "Trip request sent to drivers." });
  } else {
    res.status(404).json({ message: "No drivers found in range." });
  }
});

module.exports = router;
