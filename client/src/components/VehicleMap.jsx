import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import "leaflet-routing-machine";

const VehicleMap = () => {
  const [map, setMap] = useState(null);
  const [source, setSource] = useState({ lat: 57.74, lng: 11.94 });
  const [destination, setDestination] = useState({ lat: 57.6792, lng: 11.949 });

  useEffect(() => {
    if (!map) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(source.lat, source.lng),
        L.latLng(destination.lat, destination.lng),
      ],
      routeWhileDragging: true,
      show: false,
      routerPlan: false,
    }).addTo(map);

    return () => {
      if (map && routingControl) {
        map.removeControl(routingControl);
      }
    };
  }, [map, source, destination]);

  const redIcon = new L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <!-- Outer pin -->
  <path
    d="M12 0C8.14 0 5 3.14 5 7c0 3.94 7 16.5 7 16.5S19 10.94 19 7c0-3.86-3.14-7-7-7z"
    fill="red"
    stroke="black"
    stroke-width="0.5"
  />
  <!-- Inner white circle -->
  <circle cx="12" cy="7" r="3" fill="white" />
</svg>`,
    className: "custom-red-marker",
    iconSize: [24, 24],
    iconAnchor: [12, 24],
  });

  return (
    <MapContainer
      center={[57.7092, 11.945]}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
      whenReady={(mapInstance) => setMap(mapInstance.target)}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[source.lat, source.lng]} /> 
      <Marker position={[destination.lat, destination.lng]} icon={redIcon} /> 
    </MapContainer>
  );
};

export default VehicleMap;
