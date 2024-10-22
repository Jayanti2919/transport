const express = require("express");
const redis = require("redis");
const Driver = require("../models/driver.model");
const User = require("../models/customer.model");
const TripDetails = require("../models/trip.model");
const { server } = require("../index");

const io = require("socket.io")(server);

const router = new express.Router();
const redisClient = redis.createClient();

router.route("/fetchUserDetails").get(async (req, res) => {
  const user_id = req.headers["user_id"];
  var user = await User.findOne({ _id: user_id });
  if (!user) {
    res.status(500).json({ message: "Could not find user" });
    return;
  }
  if(user.trip_history.length > 0) {
    var lastTrip = user.trip_history[user.trip_history.length - 1];
    var trip = TripDetails.findOne({_id: lastTrip._id});
    if(!trip) {
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
  let cursor = "0";
  let possibleDrivers = [];
  do {
    const result = await redisClient.scan(cursor);
    cursor = result[0];
    const keys = result[1];

    if (keys.length > 0) {
      keys.forEach((key) => {
        let driver = Driver.findOne({ socketId: key });
        if (driver) {
          if (driver.country === body.country && driver.vehicle_type === body.vehicleType) {
            let driverLat;
            redisClient.hGet(key, "lat", (err, lat) => {
              if (err) {
                console.log(err);
              } else {
                driverLat = lat;
              }
            });
            let driverLng;
            redisClient.hGet(key, "lng", (err, lng) => {
              if (err) {
                console.log(err);
              } else {
                driverLng = lng;
              }
            });
            if (driverLat && driverLng) {
              let distance = haversineDistance(
                driverLat,
                driverLng,
                body.source.lat,
                body.source.lng
              );
              if (distance <= 5) {
                possibleDrivers.push(driver.socketId);
              }
            }
          }
        }
      });
    }
  } while (cursor !== "0");
  if (possibleDrivers.length > 0) {
    // Emit trip request to all possible drivers
    possibleDrivers.forEach((socketId) => {
      io.to(socketId).emit("tripRequest", {
        customerId: body.customerId,
        source: body.source,
        destination: body.destination,
        amount: body.estimatedAmount
      });
    });
    res.status(200).json({ message: "Trip request sent to drivers." });
  } else {
    res.status(404).json({ message: "No drivers found in range." });
  }
});

module.exports = router;
