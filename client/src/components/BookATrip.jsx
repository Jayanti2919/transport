import React, { useState, useEffect } from "react";
import axios from "axios";
import VehicleMap from "./VehicleMap";

const BookATrip = ({user, socketId}) => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [error, setError] = useState(null);
  const [sourceCoordinates, setSourceCoordinates] = useState(null);
  const [destinationCoordinates, setDestinationCoordinates] = useState(null);
  const [results, setResults] = useState([]);
  const [searchingSource, setSearchingSource] = useState(false);
  const [vehicleType, setVehicleType] = useState("bike");
  const [estimatedCost, setEstimatedCost] = useState("--");


  const fetchGeocode = async (address) => {
    const response = await axios.post("http://localhost:5000/proxy/geocode", {
      address,
    });
    setResults(response.data);
  };

  const handleRequestTrip = async () => {
    setError(null);
    console.log(source);
    try {
      console.log("trip request called");
      const tripRequest = {
        source: sourceCoordinates,
        destination: destinationCoordinates,
        vehicleType: vehicleType,
        estimatedAmount: estimatedCost,
        country: user.country,
        customerId: user._id,
        formattedSource: source,
        formattedDestination: destination,
        socketId: socketId,
      };

      const response = await axios.post("http://localhost:5000/user/api/requestTrip", tripRequest);
      console.log(response.data)
      if (response.data) {
        alert(response.data.message);
      } else {
        throw new Error('Failed to request trip');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  function haversineDistance(lat1, lng1, lat2, lng2) {
    const toRadians = (degrees) => degrees * (Math.PI / 180);

    const R = 6371;
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance;
  }

  const handleVehicleChange = (e) => {
    const selectedVehicle = e.target.value;
    setVehicleType(selectedVehicle);

    if (!sourceCoordinates || !destinationCoordinates) {
      let cost;
      switch (selectedVehicle) {
        case "bike":
          cost = "₹50 - ₹100";
          break;
        case "small_vehicle":
          cost = "₹100 - ₹200";
          break;
        case "large_vehicle":
          cost = "₹200 - ₹500";
          break;
        default:
          cost = "--";
      }
      setEstimatedCost(cost);
    } else {
      var distance = haversineDistance(
        sourceCoordinates.lat,
        sourceCoordinates.lng,
        destinationCoordinates.lat,
        destinationCoordinates.lng
      );
      let cost;
      switch (selectedVehicle) {
        case "bike":
          cost = String(Math.ceil(15 * distance));
          break;
        case "small_vehicle":
          cost = String(Math.ceil(30 * distance));
          break;
        case "large_vehicle":
          cost = String(Math.ceil(60 * distance));
          break;
        default:
          cost = "--";
      }
      setEstimatedCost(cost);
    }
  };

  return (
    <div className="flex flex-col gap-5 min-h-screen">
      <div className="grid grid-cols-2">
        {/* Source Input */}
        <div className="flex flex-col gap-2 items-center">
          <div className="flex gap-2">
            <input
              type="text"
              value={source}
              onChange={(e) => {
                setSource(e.target.value);
                setSearchingSource(true);
              }}
              onClick={(e) => {
                setSearchingSource(true);
              }}
              placeholder="Enter source address"
              className="py-2 px-4 active:border-none text-accent rounded-full focus:outline-none"
            />
            <button
              className="bg-accent2 rounded-full text-sm px-2 py-1 hover:bg-secondary"
              onClick={(e) => {
                e.preventDefault();
                fetchGeocode(source);
              }}
            >
              Search
            </button>
          </div>
          {searchingSource && (
            <div
              className={`flex flex-col ${
                searchingSource && results.length > 0
                  ? "block bg-secondary"
                  : "hidden"
              } px-2 py-2 rounded-md mt-2`}
            >
              {results.map((result) => (
                <div
                  key={result.formatted}
                  className="flex justify-between items-center border border-accent px-5 py-1"
                >
                  <p>{result.formatted}</p>
                  <button
                    onClick={() => {
                      setSource(result.formatted);
                      setSourceCoordinates(result.geometry);
                      setResults([]);
                    }}
                    className="border border-accent px-2 max-h-10 py-1 rounded-lg hover:bg-secondary text-xs"
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Destination Input */}
        <div className="flex flex-col gap-2 items-center">
          <div className="flex gap-2">
            <input
              type="text"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setSearchingSource(false);
              }}
              placeholder="Enter destination address"
              className="py-2 px-4 active:border-none text-accent rounded-full focus:outline-none"
            />
            <button
              className="bg-accent2 rounded-full text-sm px-2 py-1 hover:bg-secondary"
              onClick={(e) => {
                e.preventDefault();
                fetchGeocode(destination);
              }}
            >
              Search
            </button>
          </div>
          {!searchingSource && (
            <div
              className={`flex flex-col ${
                !searchingSource && results.length > 0
                  ? "block bg-secondary"
                  : "hidden"
              } px-2 py-2 rounded-md mt-2`}
            >
              {results.map((result) => (
                <div
                  key={result.formatted}
                  className="flex justify-between items-center border border-accent px-5 py-1"
                >
                  <p>{result.formatted}</p>
                  <button
                    onClick={() => {
                      setDestination(result.formatted);
                      setDestinationCoordinates(result.geometry);
                      setResults([]);
                    }}
                    className="border border-accent px-2 max-h-10 py-1 rounded-lg hover:bg-secondary text-xs"
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Vehicle Type Selection */}
      <div className="flex flex-col gap-2 items-center">
        <label htmlFor="vehicleType">Select Vehicle Type:</label>
        <select
          id="vehicleType"
          name="vehicleType"
          value={vehicleType}
          onChange={handleVehicleChange}
          className="py-2 px-4 active:border-none text-accent rounded-full focus:outline-none"
        >
          <option value="bike">Bike</option>
          <option value="small_vehicle">Small Vehicle</option>
          <option value="large_vehicle">Large Vehicle</option>
        </select>

        {/* Display Estimated Cost */}
        <div id="estimatedCost" className="mt-4">
          <p>
            Estimated Cost: <span>{estimatedCost}</span>
          </p>
        </div>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Request Button */}
      <button
        onClick={handleRequestTrip}
        className="bg-accent2 rounded-full text-sm px-2 py-1 hover:bg-secondary"
      >
        Request
      </button>

      {/* Display Leaflet Map with markers */}
      {sourceCoordinates && destinationCoordinates && (
        <VehicleMap
          source={sourceCoordinates}
          destination={destinationCoordinates}
        />
      )}
    </div>
  );
};

export default BookATrip;
