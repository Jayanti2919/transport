const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp_status: { 
    type: String, 
    enum: [null, 'sent', 'verified'], 
    default: null 
  },
  last_otp: { type: Number }
});

module.exports = mongoose.model('Admin', AdminSchema);
