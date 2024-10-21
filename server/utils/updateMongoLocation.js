const mongoose = require('mongoose');
const Drivers = require('../models/driver.model');

const updateDriverStatus = ({location, status, socket_id, vehicle_id}) => {
    Drivers.findOneAndUpdate(
        {vehicleId: vehicle_id},
        {socketId: socket_id},
        {status: status},
        {location: location},
        {new: true},
        (err, updatedDriver) => {
            if(err) {
                console.log("Error updating driver: ", err);
            }
            else{
                console.log(`Driver ${updatedDriver.name}'s socketId updated to: ${updatedDriver.socketId}`);
            }
        }
    )
}

module.exports = {
    updateDriverStatus,
}