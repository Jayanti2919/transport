import React from "react";
import { useState } from "react";
import { userDashboardOptions } from "../../constants";
import UserCurrentTrip from "../../components/UserCurrentTrip";
import BookATrip from "../../components/BookATrip";
import TripHistory from "../../components/TripHistory";

const UserDashboard = () => {
  const [name, setName] = useState("User");
  const [activeOption, setActiveOption] = useState(0);
  const [currentTrip, setCurrentTrip] = useState({location: "hi"});
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
          <span className="text-xl">Oops! Looks like you don't have any active trips</span>
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
          <UserCurrentTrip currentTrip={currentTrip} />
        </div>
      </div>
      <div className={`${activeOption === 1 ? "block" : "hidden"}`}>
        <BookATrip />
      </div>
      <div className={`${activeOption === 2 ? "block" : "hidden"}`}>
        <TripHistory />
      </div>
    </div>
  );
};

export default UserDashboard;
