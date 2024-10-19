import React, { useState, useEffect } from "react";
import { IoFilterOutline } from "react-icons/io5";
import { vehicleDisplayTitles } from "../constants";
import TablePagination from "@mui/material/TablePagination";
import { FaCheck } from "react-icons/fa6";

const AllVehiclesDisplay = () => {
  const statusOptions = ["In transit", "Available", "Offline"];
  const mockVehicleData = Array.from({ length: 50 }, (_, index) => ({
    id: index + 1,
    number: `Vehicle ${index + 1}`,
    driverName: `Driver ${index + 1}`,
    phone: `999-123-000${index + 1}`,
    status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
    location: `Location ${index + 1}`,
    type: index % 2 === 0 ? "Sedan" : "SUV",
    model: `Model ${index + 1}`,
  }));

  const [openFilterTab, setOpenFilterTab] = useState(false);
  const [availableCheck, setAvailableCheck] = useState(false);
  const [offlineCheck, setOfflineCheck] = useState(false);
  const [inTransitCheck, setInTransitCheck] = useState(false);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle filter toggle
  const handleFilterChange = (filterName) => {
    switch (filterName) {
      case "available":
        setAvailableCheck(!availableCheck);
        break;
      case "offline":
        setOfflineCheck(!offlineCheck);
        break;
      case "inTransit":
        setInTransitCheck(!inTransitCheck);
        break;
      default:
        break;
    }
  };

  // Apply filters
  const filteredData = mockVehicleData.filter((vehicle) => {
    if (availableCheck && vehicle.status === "Available") return true;
    if (offlineCheck && vehicle.status === "Offline") return true;
    if (inTransitCheck && vehicle.status === "In transit") return true;
    if (!availableCheck && !offlineCheck && !inTransitCheck) return true; // No filter selected
    return false;
  });

  // Pagination logic to slice filtered data
  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            className="shadow-xl hover:bg-secondary px-5 py-2 flex gap-2 rounded-md items-center bg-accent2 text-xs"
            onClick={() => {
              setOpenFilterTab(!openFilterTab);
            }}
          >
            <IoFilterOutline />
            <span>Filter</span>
          </button>
          <div
            className={`bg-accent2 px-5 py-2 text-xs rounded-md ${
              openFilterTab ? "block" : "hidden"
            }`}
          >
            <ul className="flex gap-2">
              <li
                className="flex gap-2"
                onClick={() => {
                  handleFilterChange("available");
                }}
              >
                <div className="h-4 w-4 bg-secondary text-center">
                  <FaCheck className={`${availableCheck ? "block" : "hidden"}`} />
                </div>
                <span>Available</span>
              </li>
              <li
                className="flex gap-2"
                onClick={() => {
                  handleFilterChange("offline");
                }}
              >
                <div className="h-4 w-4 bg-secondary">
                  <FaCheck className={`${offlineCheck ? "block" : "hidden"}`} />
                </div>
                <span>Offline</span>
              </li>
              <li
                className="flex gap-2"
                onClick={() => {
                  handleFilterChange("inTransit");
                }}
              >
                <div className="h-4 w-4 bg-secondary">
                  <FaCheck className={`${inTransitCheck ? "block" : "hidden"}`} />
                </div>
                <span>In Transit</span>
              </li>
            </ul>
          </div>
        </div>
        <form className="flex gap-2 items-center justify-center">
          <input
            type="text"
            placeholder="Search by vehicle number"
            className="py-2 px-4 active:border-none text-accent rounded-full focus:outline-none text-xs"
          />
          <button
            type="submit"
            className="bg-accent2 hover:bg-secondary shadow-lg text-white px-4 py-2 rounded-full text-xs"
          >
            <span>Search</span>
          </button>
        </form>
      </div>

      {/* Horizontal scrolling container */}
      <div className="overflow-x-auto mt-5">
        <div
          className="grid bg-secondary justify-between"
          style={{
            gridTemplateColumns: `repeat(${vehicleDisplayTitles.length}, minmax(150px, 1fr))`,
          }}
        >
          {vehicleDisplayTitles.map((title) => (
            <div
              className="bg-accent2 text-xs py-2 px-2 capitalize"
              key={title}
            >
              {title}
            </div>
          ))}
        </div>

        {/* Table content */}
        {paginatedData.map((vehicle) => (
          <div
            className="grid bg-white text-xs py-2 px-2"
            style={{
              gridTemplateColumns: `repeat(${vehicleDisplayTitles.length + 1}, minmax(150px, 1fr))`,
            }}
            key={vehicle.id}
          >
            <div>{vehicle.number}</div>
            <div>{vehicle.driverName}</div>
            <div>{vehicle.phone}</div>
            <div>{vehicle.status}</div>
            <div>{vehicle.location}</div>
            <div>{vehicle.type}</div>
            <div>{vehicle.model}</div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
};

export default AllVehiclesDisplay;
