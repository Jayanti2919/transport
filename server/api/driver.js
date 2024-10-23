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
  if (driver.last_trip_id) {
    var trip = await Trip.findOne({ _id: driver.last_trip_id });
    if (trip && trip.status === "in-transit") {
      res.status(200).json({ driver: driver, lastTrip: trip });
      return;
    }
  }
  res.status(200).json({ driver: driver, lastTrip: null });
});

router.route("/endTrip").post(async (req, res) => {
  const body = req.body;
  console.log(body);
  var trip = await Trip.findOne({ _id: body._id });
  if (!trip) {
    res.status(500).json({ message: "Could not find trip" });
    return;
  }
  trip.end_time = new Date();
  trip.status = "completed";
  var customer = await Customer.findOne({ _id: trip.customerId });
  trip.save();

  var driver = await Driver.findOne({ _id: trip.driverId });
  if (!driver) {
    res.status(500).json({ message: "Could not find driver" });
    return;
  }
  driver.status = "available";
  const driver_id = driver._id.toString();
  console.log(driver_id);
  redisClient.sAdd("availableDrivers", driver_id);
  driver.save();

  eventEmitter.emit("tripEnded", trip, trip.customer_socket);
  res.status(200).json({ message: "Trip ended successfully" });
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
    driverId: driver._id,
    customerId: body.customerId,
    status: "in-transit",
    source: body.source,
    destination: body.destination,
    source_area: body.formattedSource,
    destination_area: body.formattedDestination,
    start_time: new Date(),
    price: body.amount,
    customer_socket: body.socketId,
  });
  driver.current_trip_id = trip._id;
  driver.trip_history.push(trip._id);
  driver.last_trip_id = trip._id;
  driver.status = "in-transit";
  driver.save();
  customer.trip_history.push(trip._id);
  customer.save();

  redisClient.sRem("availableDrivers", driver_id);

  eventEmitter.emit("tripAccepted", trip, body.socketId);
  res.status(200).json({
    message: "Trip accepted",
    trip,
  });
});

module.exports = router;
