import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DriverMap from "../../components/DriverMap";

// Connect to the backend server
const socket = io("http://localhost:5000/drivers");

const DriverApp = () => {
  const [online, setOnline] = useState(false);
  const [buttonText, setButtonText] = useState("Go Online");
  const [vehicleId, setVehicleId] = useState("");
  const [driverId, setDriverId] = useState("");
  const nav = useNavigate();
  const token = window.localStorage.getItem("driverAccessToken");
  const [driverData, setDriverData] = useState(null);
  const [currLocation, setCurrentLocation] = useState(null);
  const [socketId, setSocketId] = useState("");
  const [goneOnline, setGoneOnline] = useState(false);
  const [tripRequest, setTripRequest] = useState(null);
  const [currTrip, setCurrTrip] = useState(null);

  const handleEndTrip = async (e) => {
    e.preventDefault();
    console.log("Ending trip");
  };

  const handleAccept = async (e) => {
    e.preventDefault();
    console.log("Accepting trip request");

    try {
      const token = window.localStorage.getItem("driverAccessToken");

      const tripDetails = {
        customerId: tripRequest.customerId,
        source: tripRequest.source,
        destination: tripRequest.destination,
        formattedSource: tripRequest.formattedSource,
        formattedDestination: tripRequest.formattedDestination,
        amount: tripRequest.amount,
        driverId: driverId,
      };

      const response = await axios.post(
        "http://localhost:5000/driver/api/acceptTrip",
        tripDetails,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Trip accepted successfully");
        console.log(response.data.trip);
        setCurrTrip(response.data.trip);
        setTripRequest(null);
        console.log("Trip accepted successfully:", response.data);
      } else {
        console.error("Failed to accept the trip:", response.data.message);
      }
    } catch (error) {
      console.error(
        "Error accepting the trip:",
        error.response || error.message
      );
    }
  };

  const handleDecline = (e) => {
    e.preventDefault();
    console.log("Rejecting trip request");
    setTripRequest(null);
  };

  useEffect(() => {
    if (currTrip) return;
    socket.on("tripRequest", (request) => {
      console.log("Trip request received:", request);
      setTripRequest(request);
    });

    return () => {
      socket.off("tripRequest");
    };
  }, []);

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

      setCurrentLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      socket.emit("driverOnline", locationData);

      setGoneOnline(true);
      setOnline(true);
    });
  };

  const handleGoOffline = () => {
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

      setCurrentLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      socket.emit("driverOffline", locationData);

      setGoneOnline(false);
      setOnline(false);
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
          "http://localhost:5000/driver/api/fetchDriverDetails",
          {
            headers: {
              "Content-Type": "application/json",
              driver_id: driverId,
            },
          }
        );

        if (res.status === 200) {
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
            else handleGoOffline();
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
          {online && !currTrip && (
            <div className="bg-secondary shadow-md rounded-md px-2 py-2">
              <span>Your Requests</span>
              {tripRequest && (
                <div className="border-accent2 border-1 rounded-md p-2 mt-2 text-xs mb-2">
                  <h3 className="text-sm mb-2">New Trip Request</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-accent">Source</span>
                    <span>{tripRequest.formattedSource}</span>
                    <span className="text-accent">Destination</span>
                    <span>{tripRequest.formattedDestination}</span>
                    <span className="text-accent">Amount</span>
                    <span>Rs. {tripRequest.amount}</span>
                    <button
                      className="border-1 border-accent border px-2 py-2 hover:bg-accent2"
                      onClick={handleAccept}
                    >
                      Accept
                    </button>
                    <button
                      className="border-1 border-accent border px-2 py-2 hover:bg-accent"
                      onClick={handleDecline}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {online && currTrip && (
            <div className="bg-secondary shadow-md rounded-md px-2 py-2">
              <span>Current Trip</span>
              <div className="border-accent2 border-1 rounded-md p-2 mt-2 text-xs mb-2">
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-accent">Source</span>
                  <span>{currTrip.source_area}</span>
                  <span className="text-accent">Destination</span>
                  <span>{currTrip.destination_area}</span>
                  <span className="text-accent">Amount</span>
                  <span>Rs. {currTrip.price}</span>
                  <button
                    className="border-1 border-accent border px-2 py-2 hover:bg-accent2"
                    onClick={handleEndTrip}
                  >
                    End Trip
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {currTrip && (
          <div className="px-4">
            <DriverMap
              source={currTrip.source}
              destination={currTrip.destination}
              driverLocation={currLocation}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverApp;
