import React, { useEffect } from 'react';
import io from 'socket.io-client';

// Connect to the backend server
const socket = io('http://localhost:5000'); // Replace with your backend URL

const DriverApp = () => {
  useEffect(() => {
    // Function to get driver's location and send it to the server
    const sendDriverLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const locationData = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            driverId: '12345',  // Replace with actual driver ID or trip ID
          };
          // Emit the driver's location to the server
          socket.emit('driverLocationUpdate', locationData);
        });
      } else {
        console.log('Geolocation is not supported by this browser.');
      }
    };

    // Send location every 10 seconds
    const locationInterval = setInterval(sendDriverLocation, 10000);

    // Cleanup interval on component unmount
    return () => {
      clearInterval(locationInterval);
    };
  }, []);

  return (
    <div>
      <h1>Driver's Location is being shared...</h1>
    </div>
  );
};

export default DriverApp;
