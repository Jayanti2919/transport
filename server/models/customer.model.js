const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  customerId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  country_code: { type: String, required: true },
  phone: { type: Number, required: true },
  email: { type: String, required: true },
  otp_status: { 
    type: String, 
    enum: [null, 'sent', 'verified'], 
    default: null 
  },
  last_otp: { type: Number },
  trip_history: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trip' }]
});

module.exports = mongoose.model('Customer', CustomerSchema);
