const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema({
  vehicleId: { type: String, required: true },
  driverId: { type: String },
  customerId: { type: String, required: true },
  status: {
    type: String,
    enum: ["in-transit", "completed"],
    default: "in-transit",
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
  customer_socket: {type: String},
});

module.exports = mongoose.model('Trip', TripSchema);
