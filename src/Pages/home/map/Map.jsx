import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { motion } from "framer-motion";
import "leaflet/dist/leaflet.css";
const Map = () => {
  const cities = [
    { name: "Dhaka", position: [23.8103, 90.4125] },
    { name: "Chittagong", position: [22.3569, 91.7832] },
    { name: "Sylhet", position: [24.8949, 91.8687] },
    { name: "Rajshahi", position: [24.3745, 88.6042] }
  ];
  return (
    <section className="w-full p-6 rounded-2xl shadow-md mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Our Delivery Coverage</h2>
      <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-lg">
        <MapContainer center={[23.8103, 90.4125]} zoom={7} className="w-full h-full">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {cities.map((city, i) => (
            <Marker key={i} position={city.position}>
              <Popup>{city.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
};

export default Map;