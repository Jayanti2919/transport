import React, { useState } from "react";
import { IoFilterOutline } from "react-icons/io5";
import { vehicleDisplayTitles } from "../constants";
import TablePagination from '@mui/material/TablePagination';

const AllVehiclesDisplay = () => {
  const mockVehicleData = Array.from({ length: 50 }, (_, index) => ({
    id: index + 1,
    number: `Vehicle ${index + 1}`,
    driverName: `Driver ${index + 1}`,
    phone: `999-123-000${index + 1}`,
    status: index % 2 === 0 ? "Active" : "Inactive",
    location: `Location ${index + 1}`,
    type: index % 2 === 0 ? "Sedan" : "SUV",
    model: `Model ${index + 1}`,
  }));

  const [openFilterTab, setOpenFilterTab] = useState(false);
  
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

  // Pagination logic to slice data
  const paginatedData = mockVehicleData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="shadow-xl hover:bg-secondary px-5 py-2 flex gap-2 rounded-md items-center bg-accent2 text-xs">
            <IoFilterOutline />
            <span>Filter</span>
          </button>
          <div className={`bg-accent2 px-5 py-2 text-xs rounded-md`}>Filter options</div>
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
            gridTemplateColumns: `repeat(${vehicleDisplayTitles.length + 1}, minmax(150px, 1fr))`,
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
          <div className="bg-accent2 text-xs text-center py-2 px-2">Actions</div>
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
            <div>
              <button className="bg-blue-500 text-white px-2 py-1 rounded-md">Details</button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={mockVehicleData.length}
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
