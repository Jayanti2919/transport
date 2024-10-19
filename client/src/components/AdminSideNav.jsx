import React from "react";
import { logo } from "../assets";
import { IoHomeOutline } from "react-icons/io5";
import { MdKeyboardArrowRight } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useState } from "react";
import { adminNavOptionsFleet, adminNavOptionsData } from "../constants";
import { useNavigate } from "react-router-dom";

const AdminSideNav = ({ active, fleetMgmt, dataAnalytics }) => {
  const [fleetMgmtActive, setFleetMgmtActive] = useState(fleetMgmt);
  const [dataAnalyticsActive, setDataAnalyticsActive] = useState(dataAnalytics);
  const nav = useNavigate();
  return (
    <div className="bg-secondary absolute left-0 min-h-screen h-full px-5 flex flex-col gap-6 whitespace-normal text-wrap min-w-52 max-w-52">
      <div className="mt-10">
        <img src={logo} alt="logo" />
      </div>
      <div
        className={`flex gap-2 hover:cursor-pointer items-center ${
          active === "home" ? "bg-primary " : "bg-secondary"
        } rounded-md px-1 py-1`}
        onClick={() => {
          nav("/admin/dashboard");
        }}
      >
        <IoHomeOutline className="text-md" />
        <span className="">Home</span>
      </div>
      <div>
        <div
          className="flex gap-1 items-center cursor-pointer"
          onClick={() => {
            setFleetMgmtActive(!fleetMgmtActive);
          }}
        >
          <MdKeyboardArrowRight
            className={`${fleetMgmtActive ? "hidden" : "block"}`}
          />
          <MdKeyboardArrowDown
            className={`${fleetMgmtActive ? "block" : "hidden"}`}
          />
          <span>Fleet Management</span>
        </div>
        <div className={`${fleetMgmtActive ? "block" : "hidden"} pl-6 mt-2`}>
          <ul className="flex flex-col gap-5 text-sm">
            {adminNavOptionsFleet.map((item, index) => (
              <li
                key={index}
                className={`flex gap-2 hover:cursor-pointer items-center rounded-md px-1 py-1 ${
                  active === item.title.toLowerCase()
                    ? "bg-primary"
                    : "bg-secondary"
                }`}
                onClick={() => {
                  nav(item.link);
                }}
              >
                <item.icon className="text-xl" />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        <div
          className="flex gap-1 items-center cursor-pointer"
          onClick={() => {
            setDataAnalyticsActive(!dataAnalyticsActive);
          }}
        >
          <MdKeyboardArrowRight
            className={`${dataAnalyticsActive ? "hidden" : "block"}`}
          />
          <MdKeyboardArrowDown
            className={`${dataAnalyticsActive ? "block" : "hidden"}`}
          />
          <span>Data Analytics</span>
        </div>
        <div
          className={`${dataAnalyticsActive ? "block" : "hidden"} pl-6 mt-2`}
        >
          <ul className="flex flex-col gap-5 text-sm">
            {adminNavOptionsData.map((item, index) => (
              <li
                key={index}
                className={`flex gap-2 hover:cursor-pointer items-center rounded-md px-1 py-1 ${
                  active === item.title.toLowerCase()
                    ? "bg-primary"
                    : "bg-secondary"
                }`}
                onClick={() => {
                  nav(item.link);
                }}
              >
                <item.icon className="text-xl" />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminSideNav;
