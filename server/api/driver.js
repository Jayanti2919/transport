const mongoose = require("mongoose");
const Driver = require("../models/driver.model");
const Trip = require("../models/trip.model");
const Customer = require("../models/customer.model");
const express = require("express");
const { server } = require("../index");
const redisClient = require("../utils/redisConnection");
const { eventEmitter } = require("../utils/socketNamespaceInitialize");
const io = require("socket.io")(server);

const router = new express.Router();

router.route("/fetchDriverDetails").get(async (req, res) => {
  const driver_id = req.headers["driver_id"];

  var driver = await Driver.findOne({ _id: driver_id });
  if (!driver) {
    res.status(500).json({ message: "Could not find driver" });
    return;
  }
  res.status(200).json({ driver: driver });
});

router.route("/acceptTrip").post(async (req, res) => {
  const body = req.body;
  const driver_id = body.driverId;

  var driver = await Driver.findOne({ _id: driver_id });
  if (!driver) {
    res.status(500).json({ message: "Could not find driver" });
    return;
  }

  var customer = await Customer.findOne({ _id: body.customerId });
  if (!customer) {
    res.status(500).json({ message: "Could not find customer" });
    return;
  }

  var trip = await Trip.create({
    vehicleId: driver.vehicleId,
    customerId: body.customerId,
    status: "in-transit",
    source: body.source,
    destination: body.destination,
    source_area: body.formattedSource,
    destination_area: body.formattedDestination,
    start_time: new Date(),
    price: body.amount,
  });
  driver.current_trip_id = trip._id;
  driver.trip_history.push(trip._id);
  driver.status = "in-transit";
  driver.save();
  customer.trip_history.push(trip._id);
  customer.save();

  redisClient.sRem("availableDrivers", driver_id);

  eventEmitter.emit("tripAccepted", trip);
  res.status(200).json({
    message: "Trip accepted",
    trip,
  });
});

module.exports = router;
