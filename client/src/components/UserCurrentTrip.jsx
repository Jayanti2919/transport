import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import io from "socket.io-client";
import "leaflet/dist/leaflet.css";
import DriverMap from "./DriverMap";

// Connect to the backend server
const socket = io("http://localhost:5000"); // Replace with your backend URL

const UserCurrentTrip = ({ driverLocation, currentTrip, driverDetails }) => {
  return (
    <div>
      <div>
        {driverDetails ? (
          <div>
            <span>Driver Details</span>
            <div className="bg-secondary shadow-md rounded-md grid grid-cols-2 capitalize px-4 py-2 text-sm">
              <span>Name:</span>
              <span>{driverDetails.name}</span>
              <span>License Number:</span>
              <span>{driverDetails.license_number}</span>
              <span>Vehicle Number:</span>
              <span>{driverDetails.vehicleId}</span>
              <span>Vehicle Type:</span>
              <span>{driverDetails.vehicle_type}</span>
            </div>
          </div>
        ) : (
          <div>Loading driver information...</div>
        )}
      </div>
      <h1 className="mt-2">Track Driver's Live Location</h1>

      {/* Display the map only if we have the driver's location */}
      {driverLocation ? (
        <DriverMap
          source={currentTrip.source}
          destination={currentTrip.destination}
          driverLocation={driverLocation}
        />
      ) : (
        <p>Waiting for driver location...</p>
      )}
    </div>
  );
};

export default UserCurrentTrip;
