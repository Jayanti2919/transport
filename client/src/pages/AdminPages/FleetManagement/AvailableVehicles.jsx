import React from "react";
import AdminSideNav from "../../../components/AdminSideNav";
import { useState } from "react";
import { vehicleAdminOptions } from "../../../constants";
import AllVehiclesDisplay from "../../../components/AllVehiclesDisplay";
import AddNewVehicle from "../../../components/AddNewVehicle";
import RemoveVehicle from "../../../components/RemoveVehicle";

const AvailableVehicles = () => {
  const [activeOption, setActiveOption] = useState("All Vehicles");
  return (
    <div className="relative">
      <AdminSideNav
        active="available vehicles"
        fleetMgmt={true}
        dataAnalytics={false}
      />
      <div className="ml-52 px-10 py-6 flex flex-col gap-10">
        <div>
          <span className="rammetto capitalize text-secondary text-shadow text-4xl">
            available vehicles
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {vehicleAdminOptions.map((option) => {
            return (
              <div
                className={`flex items-center justify-center ${
                  activeOption === option.title ? "bg-secondary" : "bg-accent2"
                } shadow-md p-4 rounded-md gap-2 cursor-pointer`}
                onClick={() => setActiveOption(option.title)}
              >
                <option.icon className="text-md" />
                <span className="text-sm capitalize">{option.title}</span>
              </div>
            );
          })}
        </div>
        <div className={`${activeOption === 'All Vehicles'? 'block': 'hidden'}`}>
          <AllVehiclesDisplay />
        </div>
        <div className={`${activeOption === 'Onboard New Vehicle'? 'block': 'hidden'}`}>
          <AddNewVehicle />
        </div>
        <div className={`${activeOption === 'Remove a Vehicle'? 'block': 'hidden'}`}>
          <RemoveVehicle />
        </div>
      </div>
    </div>
  );
};

export default AvailableVehicles;
