import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import io from 'socket.io-client';
import 'leaflet/dist/leaflet.css';

// Connect to the backend server
const socket = io('http://localhost:5000'); // Replace with your backend URL

const UserCurrentTrip = () => {
  const [driverLocation, setDriverLocation] = useState(null);

  useEffect(() => {
    // Listen for broadcasted driver location updates
    socket.on('broadcastDriverLocation', (locationData) => {
      console.log('Driver location received on customer side:', locationData);
      setDriverLocation(locationData); // Update state with new driver location
    });

    // Cleanup on component unmount
    return () => {
      socket.off('broadcastDriverLocation');
    };
  }, []);

  return (
    <div>
      <h1>Track Driver's Live Location</h1>

      {/* Display the map only if we have the driver's location */}
      {driverLocation ? (
        <MapContainer
          center={[driverLocation.lat, driverLocation.lng]}
          zoom={13}
          style={{ height: '400px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[driverLocation.lat, driverLocation.lng]} />
        </MapContainer>
      ) : (
        <p>Waiting for driver location...</p>
      )}
    </div>
  );
};

export default UserCurrentTrip;
