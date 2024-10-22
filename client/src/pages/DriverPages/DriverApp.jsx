import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DriverMap from "../../components/DriverMap";

// Connect to the backend server
const socket = io("http://localhost:5000");

const DriverApp = () => {
  const [online, setOnline] = useState(false);
  const [buttonText, setButtonText] = useState("Go Online");
  const [vehicleId, setVehicleId] = useState("");
  const [driverId, setDriverId] = useState("");
  const nav = useNavigate();
  const token = window.localStorage.getItem("accessToken");
  const [driverData, setDriverData] = useState(null);
  const [currLocation, setCurrentLocation] = useState(null);
  const [socketId, setSocketId] = useState("");
  const [goneOnline, setGoneOnline] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("Connected with socket ID:", socket.id);
    });
    return () => {
      socket.off("connect");
    };
  }, []);

  const handleGoOnline = () => {
    console.log("button clicked");
    console.log(online);
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const locationData = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        driverId: driverId,
      };

      setCurrentLocation(locationData);
      socket.emit("driverOnline", locationData);

      setGoneOnline(true);
      setOnline(true);
    });
  };

  useEffect(() => {
    if (!token) {
      nav("/driverLogin");
    }
    const validateToken = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/driver/validateToken",
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        if (response.status !== 200) {
          // console.log(response.data);
          nav("/driverLogin");
        } else {
          setVehicleId(response.data.user.vehicle_id);
          setDriverId(response.data.user.id);
        }
      } catch (error) {
        console.error(
          "Error validating token:",
          error.response || error.message
        );
        nav("/driverLogin");
      }
    };
    validateToken();
  }, [token, nav]);

  useEffect(() => {
    if (!driverId) return;

    const getDriverData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/fetchDriverDetails",
          {
            headers: {
              "Content-Type": "application/json",
              driver_id: driverId,
            },
          }
        );

        if (res.status === 200) {
          console.log(res.data);
          setDriverData(res.data.driver);
        } else {
          console.log(res.data);
        }
      } catch (err) {
        console.log("Error fetching driver data:", err);
      }
    };

    getDriverData();
  }, [driverId]);

  useEffect(() => {
    if (!online || !goneOnline) return;
    const sendDriverLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const locationData = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            driverId: driverId,
          };
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
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
  }, [online, vehicleId, goneOnline]);

  useEffect(() => {
    const updateButton = () => {
      if (online) setButtonText("Go Offline");
      else setButtonText("Go Online");
    };
    updateButton();
  }, [online]);

  return (
    <div className="flex flex-col px-5 py-5 gap-6">
      <h2 className="text-4xl rammetto text-secondary text-shadow capitalize">
        your dashboard
      </h2>
      <div className="flex items-center justify-center">
        <button
          onClick={(e) => {
            e.preventDefault();
            if (!online) handleGoOnline();
          }}
          className="bg-accent2 py-2 w-1/2 rounded-full hover:bg-secondary"
        >
          {buttonText}
        </button>
      </div>
      <div className="grid grid-cols-2">
        <div className="flex flex-col gap-3">
          {driverData ? (
            <div className="bg-secondary shadow-md rounded-md grid grid-cols-2 capitalize px-4 py-2 text-sm">
              <span>Name:</span>
              <span>{driverData.name}</span>
              <span>License Number:</span>
              <span>{driverData.license_number}</span>
              <span>Country:</span>
              <span>{driverData.country}</span>
              <span>Vehicle Number:</span>
              <span>{driverData.vehicleId}</span>
              <span>Vehicle Type:</span>
              <span>{driverData.vehicle_type}</span>
            </div>
          ) : (
            <div>Loading driver information...</div>
          )}
          {online && (
            <div className="bg-secondary shadow-md rounded-md px-2 py-2">
              <span>Your Requests</span>
            </div>
          )}
        </div>
        <div>map</div>
      </div>
    </div>
  );
};

export default DriverApp;
