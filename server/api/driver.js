const mongoose = require("mongoose");
const Driver = require("../models/driver.model");
const express = require("express");

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

module.exports = router;