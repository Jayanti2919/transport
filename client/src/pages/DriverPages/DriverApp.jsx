import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Connect to the backend server
const socket = io("http://localhost:5000");

const DriverApp = () => {
  const [online, setOnline] = useState(false);
  const [vehicleId, setVehicleId] = useState("");
  const nav = useNavigate();
  const token = window.localStorage.getItem("accessToken");
  useEffect(() => {
    if (!token) {
      nav("/driverLogin");
    }
    const validateToken = async () => {
      try {
        const response = await axios.get("http://localhost:5000/driver/validateToken", {
          headers: {
            Authorization: `${token}`,
          },
        });
        if (response.status !== 200) {
          console.log(response.data);
          nav("/driverLogin");
        } else {
          setVehicleId(response.data.user.vehicle_id);
        }
      } catch (error) {
        console.error("Error validating token:", error.response || error.message);
        nav("/driverLogin");
      }
    };    
    validateToken();
  }, [token, nav]);

  useEffect(() => {
    if (!online) return;
    const sendDriverLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const locationData = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            driverId: "12345",
          };
          socket.emit("driverLocationUpdate", locationData);
        });
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    };

    const locationInterval = setInterval(sendDriverLocation, 10000);
    return () => {
      clearInterval(locationInterval);
    };
  }, []);

  return (
    <div>
      <button
        onClick={(e) => {
          e.preventDefault();
          setOnline(true);
        }}
      >
        Go Online
      </button>
      <span>{vehicleId}</span>
    </div>
  );
};

export default DriverApp;
