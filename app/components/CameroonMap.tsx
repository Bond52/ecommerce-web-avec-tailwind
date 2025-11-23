"use client";

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

export default function CameroonMap() {
  const [geo, setGeo] = useState<any>(null);

  useEffect(() => {
    fetch("/maps/cameroon-regions.json")
      .then((res) => res.json())
      .then(setGeo)
      .catch(console.error);
  }, []);

  const style = {
    fillColor: "#f4c27a",
    weight: 1,
    opacity: 1,
    color: "#8a5500",
    fillOpacity: 0.6,
  };

  if (!geo) {
    return (
      <div className="text-center py-6 text-sawaka-600">
        Chargement de la carte…
      </div>
    );
  }

  return (
    <div className="wrap my-16">
      <h2 className="text-3xl md:text-4xl font-bold text-sawaka-800 mb-4 text-center">
        Artisans par région du Cameroun
      </h2>
      <p className="text-lg text-sawaka-600 max-w-2xl mx-auto text-center mb-8">
        Découvrez la répartition géographique des artisans sur la plateforme
      </p>

      {/* Ajout d’une hauteur fixe pour que la carte apparaisse */}
      <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-md">
        <MapContainer
          center={[7.3697, 12.3547]}
          zoom={6}
          scrollWheelZoom={false}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          <GeoJSON data={geo} style={() => style} />
        </MapContainer>
      </div>
    </div>
  );
}
