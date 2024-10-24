import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import "leaflet-routing-machine";
import { destinationPin } from "../assets";
import { driverPin } from "../assets";

const VehicleMap = ({ source, destination, driverLocation }) => {
  const [map, setMap] = useState(null);
  driverLocation = { lat: parseFloat(driverLocation.lat), lng: parseFloat(driverLocation.lng) };
  source = { lat: parseFloat(source.lat), lng: parseFloat(source.lng) };
  destination = { lat: parseFloat(destination.lat), lng: parseFloat(destination.lng) };
  const distance = Math.sqrt(
    Math.pow(destination.lat - source.lat, 2) +
      Math.pow(destination.lng - source.lng, 2)
  );
  const zoom = Math.floor(distance * 180);
  const midpoint = [
    (source.lat + destination.lat + driverLocation.lat) / 3,
    (source.lng + destination.lng + driverLocation.lng) / 3,
  ];

  const createDestionationIcon = () => {
    return new L.Icon({
      iconUrl: destinationPin,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });
  };

  const createDriverIcon = () => {
    return new L.Icon({
      iconUrl: driverPin,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });
  };

  const destinationIcon = createDestionationIcon();
  const driverIcon = createDriverIcon();

  useEffect(() => {
    if (!map) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(source.lat, source.lng),
        L.latLng(destination.lat, destination.lng),
      ],
      routeWhileDragging: false,
      show: false,
      routerPlan: false,
      createMarker: () => null,
    }).addTo(map);

    return () => {
      if (map && routingControl) {
        map.removeControl(routingControl);
      }
    };
  }, [map, source, destination]);

  return (
    <MapContainer
      center={[source.lat, source.lng]}
      zoom={zoom}
      style={{ height: "80vh", width: "100%" }}
      whenReady={(mapInstance) => setMap(mapInstance.target)}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[source.lat, source.lng]} />
      <Marker
        position={[destination.lat, destination.lng]}
        icon={destinationIcon}
      />
      <Marker
        position={[driverLocation.lat, driverLocation.lng]}
        icon={driverIcon}
      />
    </MapContainer>
  );
};

export default VehicleMap;
