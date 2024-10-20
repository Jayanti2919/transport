import React from "react";
import AdminSideNav from "../../components/AdminSideNav";
import { useState } from "react";
import TripDisplayAdmin from "../../components/TripDisplayAdmin";
import VehicleMap from "../../components/VehicleMap";

const AdminDashboard = () => {
  const [availableVehicles, setAvailableVehicles] = useState(462);
  const [inUseVehicles, setInUseVehicles] = useState(252);
  const [activeTrips, setActiveTrips] = useState([
    {
      id: 1,
      vehicleId: 123,
      driverId: 456,
      source: "BBSR",
      destination: "CTC",
      ETA: "14:00",
      sourcepts: {lat: 20.2961, lng: 85.8245},
      destinationpts: {lat: 20.2971, lng: 85.8242},
    },
    {
      id: 2,
      vehicleId: 123,
      driverId: 456,
      source: "BBSR",
      destination: "CTC",
      ETA: "14:00",
      sourcepts: {lat: 22.2961, lng: 85.8245},
      destinationpts: {lat: 20.2971, lng: 84.8242},
    },
    {
      id: 3,
      vehicleId: 123,
      driverId: 456,
      source: "BBSR",
      destination: "CTC",
      ETA: "14:00",
      sourcepts: {lat: 20.2961, lng: 85.8245},
      destinationpts: {lat: 20.2971, lng: 85.8242},
    },
  ]);
  const [tripID, setTripID] = useState("");
  const [selectedTrip, setSelectedTrip] = useState(0);

  const handleTrack = (e) => {
    e.preventDefault();
    console.log(tripID);
  };

  const handleTripClick = (trip, index) => {
    console.log(trip);
    setSelectedTrip(index);
  };

  return (
    <div className="relative">
      <AdminSideNav active="home" fleetMgmt={false} dataAnalytics={false}/>
      <div className="ml-52 px-10 py-6 flex flex-col gap-10">
        <div>
          <span className="rammetto capitalize text-secondary text-shadow text-4xl">
            your dashboard
          </span>
        </div>
        <div className="grid grid-cols-2">
          <div className="bg-secondary flex flex-col rounded-xl w-2/3 px-10 py-8 shadow-xl gap-2">
            <span className="text-md capitalize">available vehicles</span>
            <span className="text-4xl">{availableVehicles}</span>
          </div>
          <div className="bg-secondary flex flex-col rounded-xl w-2/3 px-10 py-8 shadow-xl gap-2">
            <span className="text-md capitalize">currently in use</span>
            <span className="text-4xl">{inUseVehicles}</span>
          </div>
        </div>
        <div className="bg-secondary rounded-xl shadow-xl px-10 py-5 grid grid-cols-2 gap-4">
          <div className="bg-primary rounded-xl px-5 py-5 flex flex-col gap-4">
            <span className="text-sm">Enter trip ID for tracking</span>
            <form action="" className="flex flex-col gap-1 text-xs">
              <input
                type="text"
                placeholder="trip id"
                className="py-1 px-4 active:border-none text-accent rounded-full focus:outline-none"
                onChange={(e) => setTripID(e.target.value)}
                required={true}
              />
              <button
                type="submit"
                className="rounded-full border border-1 py-1 hover:bg-secondary"
                onClick={handleTrack}
              >
                track
              </button>
            </form>
            <span className="text-xs">or choose from below acive trips</span>
            <div style={{ height: "150px", overflowY: "auto" }}>
              {activeTrips.map((trip, index) => (
                <div key={trip.id} onClick={() => handleTripClick(trip, index)} className={`${selectedTrip === index? 'border border-1': 'border-none'} px-2`}>
                  <TripDisplayAdmin trip={trip} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <VehicleMap source={activeTrips[selectedTrip].sourcepts} destination={activeTrips[selectedTrip].destinationpts}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
