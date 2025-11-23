"use client";

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

export default function CameroonMap() {
  const [geo, setGeo] = useState<any>(null);
  const [regionCounts, setRegionCounts] = useState<any>(null);

  useEffect(() => {
    // 1) Charger la carte géographique
    fetch("/maps/cameroon-regions.json")
      .then((res) => res.json())
      .then(setGeo)
      .catch(console.error);

    // 2) Charger les stats
    fetch("https://ecommerce-web-avec-tailwind.onrender.com/stats/artisans-par-region")
      .then((res) => res.json())
      .then(setRegionCounts)
      .catch(console.error);
  }, []);

  const style = (feature: any) => {
    const region = feature.properties.name;
    const count = regionCounts?.[region] || 0;

    return {
      fillColor: count > 0 ? "#f4c27a" : "#ddd",
      weight: 1,
      opacity: 1,
      color: "#8a5500",
      fillOpacity: count > 0 ? 0.7 : 0.3,
    };
  };

  if (!geo || !regionCounts) {
    return <p className="text-center py-6">Chargement de la carte…</p>;
  }

  return (
    <div className="wrap my-16">
      <h2 className="text-3xl md:text-4xl font-bold text-sawaka-800 mb-4 text-center">
        Artisans par région du Cameroun
      </h2>
      <p className="text-lg text-sawaka-600 max-w-2xl mx-auto text-center mb-8">
        Découvrez la répartition géographique des artisans sur la plateforme
      </p>

      <MapContainer center={[7.3697, 12.3547]} zoom={6} scrollWheelZoom={false}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <GeoJSON data={geo} style={style} />
      </MapContainer>
    </div>
  );
}
