import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const Map = () => {
  const cities = [
    { name: "Dhaka", pos: [23.8103, 90.4125] },
    { name: "Gazipur", pos: [24.0958, 90.4125] },
    { name: "Narayanganj", pos: [23.6238, 90.5000] },
    { name: "Tangail", pos: [24.2513, 89.9167] },
    { name: "Faridpur", pos: [23.6071, 89.8429] },
    { name: "Narsingdi", pos: [23.9322, 90.7154] },
    { name: "Manikganj", pos: [23.8644, 90.0047] },
    { name: "Munshiganj", pos: [23.5422, 90.5305] },
    { name: "Chittagong", pos: [22.3569, 91.7832] },
    { name: "Comilla", pos: [23.4607, 91.1809] },
    { name: "Cox's Bazar", pos: [21.4272, 92.0058] },
    { name: "Feni", pos: [23.0186, 91.3966] },
    { name: "Brahmanbaria", pos: [23.9571, 91.1119] },
    { name: "Noakhali", pos: [22.8724, 91.0973] },
    { name: "Chandpur", pos: [23.2321, 90.6631] },
    { name: "Lakshmipur", pos: [22.9447, 90.8282] },
    { name: "Sylhet", pos: [24.8949, 91.8687] },
    { name: "Moulvibazar", pos: [24.4829, 91.7774] },
    { name: "Habiganj", pos: [24.3749, 91.4155] },
    { name: "Sunamganj", pos: [25.0658, 91.3950] },
    { name: "Rajshahi", pos: [24.3745, 88.6042] },
    { name: "Bogra", pos: [24.8481, 89.3730] },
    { name: "Pabna", pos: [24.0040, 89.2500] },
    { name: "Sirajganj", pos: [24.4534, 89.7008] },
    { name: "Khulna", pos: [22.8456, 89.5403] },
    { name: "Jessore", pos: [23.1634, 89.2182] },
    { name: "Kushtia", pos: [23.9013, 89.1204] },
    { name: "Satkhira", pos: [22.7185, 89.0705] },
    { name: "Barisal", pos: [22.7010, 90.3535] },
    { name: "Patuakhali", pos: [22.3596, 90.3299] },
    { name: "Rangpur", pos: [25.7439, 89.2752] },
    { name: "Dinajpur", pos: [25.6217, 88.6355] },
    { name: "Mymensingh", pos: [24.7471, 90.4203] },
    { name: "Jamalpur", pos: [24.9375, 89.9378] },
  ];

  return (
    <section className="relative w-full overflow-hidden rounded-3xl bg-zinc-900 text-white shadow-xl p-6 mt-10">
      <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />
      <h2 className="text-3xl font-bold mb-6 text-center">Our Delivery Coverage</h2>
      <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-lg">
        <MapContainer center={[23.8103, 90.4125]} zoom={7} className="w-full h-full">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {cities.map((city, i) => (
            <Marker key={i} position={city.pos}>
              <Popup>{city.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
};

export default Map;