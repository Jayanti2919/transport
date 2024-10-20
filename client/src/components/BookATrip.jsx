import React, { useState } from "react";
import axios from "axios";
import VehicleMap from "./VehicleMap";

const BookATrip = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [error, setError] = useState(null);
  const [sourceCoordinates, setSourceCoordinates] = useState(null);
  const [destinationCoordinates, setDestinationCoordinates] = useState(null);
  const [results, setResults] = useState([]);
  const [searchingSource, setSearchingSource] = useState(false);

  const fetchGeocode = async (address) => {
    const response = await axios.post("http://localhost:5000/proxy/geocode", {
      address,
    });
    setResults(response.data);
  };

  const handleRequestTrip = async () => {
    setError(null);

    try {
      console.log("trip request called");

      // const tripRequest = {
      //   source: sourceCoords,
      //   destination: destinationCoords,
      // };

      // const response = await axios.post('http://localhost:5000/api/request-trip', tripRequest);
      // if (response.data.success) {
      //   alert('Request sent to drivers');
      // } else {
      //   throw new Error('Failed to request trip');
      // }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2">
        <div className="flex flex-col gap-2 items-center">
          <div className="flex gap-2">
            <input
              type="text"
              value={source}
              onChange={(e) => {
                setSource(e.target.value);
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
      {error && <p style={{ color: "red" }}>{error}</p>}
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
