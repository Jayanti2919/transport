const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema({
  tripId: { type: Number, required: true, unique: true },
  vehicleId: { type: String, required: true },
  customerId: { type: Number, required: true },
  status: {
    type: String,
    enum: ["available", "in-transit", "offline"],
    default: "available",
  },
  source: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  destination: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  source_area: { type: String },
  destination_area: { type: String },
  estimated_completion_time: { type: Number },
  actual_completion_time: { type: Number },
  requested_time: { type: Date, default: Date.now },
  start_time: { type: Date },
  end_time: { type: Date },
  price: { type: Number },
  payment_method: {
    type: String,
    enum: ["cash", "upi", "card", "netbanking"],
    default: "cash",
  },
});

module.exports = mongoose.model('Trip', TripSchema);
