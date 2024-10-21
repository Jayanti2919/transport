const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
  vehicleId: { type: String, required: true, unique: true },
  license_number: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: Number, required: true },
  country_code: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  status: { 
    type: String, 
    enum: ['available', 'in-transit', 'offline'], 
    default: 'available' 
  },
  vehicle_type: { 
    type: String, 
    enum: ['bike', 'small vehicle', 'large_vehicle'], 
    default: 'small vehicle' 
  },
  last_trip_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
  trip_history: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trip' }],
  username: { type: String, required: true },
  password: { type: String, required: true },
  socketId: { type: String, default: null },
});

module.exports = mongoose.model('Driver', DriverSchema);
