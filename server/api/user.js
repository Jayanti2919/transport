const express = require('express');
const redis = require('redis');
const Driver = require('../models/driver.model');
const Customer = require('../models/customer.model');
const TripDetails = require('../models/trip.model');

const router = new express.Router();

router.route('/requestTrip').post(async (req, res)=>{

})

module.exports = router;