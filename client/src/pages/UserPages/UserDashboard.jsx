import React from "react";
import { useState, useEffect } from "react";
import { userDashboardOptions } from "../../constants";
import UserCurrentTrip from "../../components/UserCurrentTrip";
import BookATrip from "../../components/BookATrip";
import TripHistory from "../../components/TripHistory";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const socket = io("http://localhost:5000/customers");
const UserDashboard = () => {
  const [name, setName] = useState("User");
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [activeOption, setActiveOption] = useState(0);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [driverDetails, setDriverDetails] = useState(null);
  const token = window.localStorage.getItem("userAccessToken");
  const nav = useNavigate();
  const [socketId, setSocketId] = useState(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected, ID:", socket.id);
      setSocketId(socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      setSocketId(null);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  useEffect(() => {
    if(!currentTrip) return;
    socket.on("tripEnded", (trip) => {
      console.log("Trip ended:", trip);
      setCurrentTrip(null);
    });
  }, []);

  useEffect(() => {
    if (!currentTrip) return;

    const fetchDriverLocation = () => {
      socket.emit("requestDriverLocation", currentTrip.driverId);
    };

    socket.on("broadcastDriverLocation", (locationData) => {
      console.log("Driver location received:", locationData);
      setDriverLocation(locationData);
    });

    const locationInterval = setInterval(fetchDriverLocation, 10000);

    return () => {
      clearInterval(locationInterval);
      socket.off("broadcastDriverLocation");
    };
  }, [currentTrip]);

  useEffect(() => {
    if (currentTrip) return;
    socket.on("tripAccepted", (trip) => {
      console.log("Trip accepted:", trip);
      setCurrentTrip(trip);
    });
  }, []);

  useEffect(() => {
    if (!token) {
      nav("/userLogin");
    }
    const validateToken = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/user/validateToken",
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        if (response.status !== 200) {
          nav("/userLogin");
        } else {
          setName(response.data.user.name);
          setUserId(response.data.user.id);
        }
      } catch (error) {
        console.error(
          "Error validating token:",
          error.response || error.message
        );
        nav("/userLogin");
      }
    };
    validateToken();
  }, [token, nav]);

  useEffect(() => {
    if (!userId) return;

    const getUserData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/user/api/fetchUserDetails",
          {
            headers: {
              "Content-Type": "application/json",
              user_id: userId,
            },
          }
        );

        if (res.status === 200) {
          console.log(res.data);
          setUser(res.data.user);
          if (res.data.lastTrip !== null) {
            setCurrentTrip(res.data.lastTrip);
            try {
              const response = await axios.get(
                "http://localhost:5000/driver/api/fetchDriverDetails",
                {
                  headers: {
                    "Content-Type": "application/json",
                    driver_id: res.data.lastTrip.driverId,
                  },
                }
              );
              if(response.status === 200) {
                console.log(response.data);
                setDriverDetails(response.data.driver);
              }
            } catch (err) {
              console.log("Error fetching driver data:", err);
            }
          }
        } else {
          console.log(res.data);
        }
      } catch (err) {
        console.log("Error fetching user data:", err);
      }
    };

    getUserData();
  }, [userId]);

  return (
    <div className="px-5 py-10 flex flex-col gap-8">
      <div className="text-4xl rammetto text-secondary text-shadow">
        Welcome, {name}!
      </div>
      <div className="grid grid-cols-3 gap-5">
        {userDashboardOptions.map((option, index) => (
          <div
            key={option}
            className={`${
              activeOption === index ? "bg-secondary" : "bg-accent2"
            } rounded-md px-4 py-2 text-center cursor-pointer`}
            onClick={() => {
              setActiveOption(index);
            }}
          >
            {option}
          </div>
        ))}
      </div>
      <div className={`${activeOption === 0 ? "block" : "hidden"} h-full`}>
        <div
          className={`${
            !currentTrip ? "block" : "hidden"
          } flex flex-col items-center justify-center gap-6 mt-10`}
        >
          <span className="text-xl">
            Oops! Looks like you don't have any active trips
          </span>
          <button
            className="bg-secondary hover:border hover:border-accent px-4 py-2 rounded-full text-accent"
            onClick={(e) => {
              e.preventDefault();
              setActiveOption(1);
            }}
          >
            Get Started
          </button>
        </div>
        <div className={`${currentTrip ? "block" : "hidden"}`}>
          <UserCurrentTrip
            driverLocation={driverLocation}
            currentTrip={currentTrip}
            driverDetails={driverDetails}
          />
        </div>
      </div>
      <div className={`${activeOption === 1 ? "block" : "hidden"}`}>
        {currentTrip ? (
          <div>You need to wait for your current trip to end.</div>
        ) : (
          <BookATrip user={user} socketId={socketId} />
        )}
      </div>
      <div className={`${activeOption === 2 ? "block" : "hidden"}`}>
        <TripHistory />
      </div>
    </div>
  );
};

export default UserDashboard;
