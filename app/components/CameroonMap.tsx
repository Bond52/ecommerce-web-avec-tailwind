"use client";

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

export default function CameroonMap() {
  const [geo, setGeo] = useState<any>(null);
  const [counts, setCounts] = useState<any>({});

  // Charger GeoJSON + backend
  useEffect(() => {
    fetch("/maps/cameroon-regions.json")
      .then((res) => res.json())
      .then(setGeo)
      .catch(console.error);

    fetch("https://ecommerce-web-avec-tailwind.onrender.com/stats/artisans-par-region")
      .then((res) => res.json())
      .then(setCounts)
      .catch(console.error);
  }, []);

  // Style simple des régions
  const regionStyle = (feature: any) => {
    const name =
      feature.properties?.region ??
      feature.properties?.name ??
      "Région";

    const value = counts[name] || 0;

    const color =
      value === 0 ? "#f0e5d8" :
      value === 1 ? "#f7c58d" :
      value === 2 ? "#ee9f49" :
      "#d97904";

    return {
      fillColor: color,
      weight: 1,
      opacity: 1,
      color: "#8a5500",
      fillOpacity: 0.7,
    };
  };

  // Tooltip simple au survol
  const onEachRegion = (feature: any, layer: L.Layer) => {
    const name =
      feature.properties?.region ??
      feature.properties?.name ??
      "Région";

    const value = counts[name] || 0;

    layer.bindTooltip(`${name} : ${value} artisan(s)`, {
      sticky: true,
    });
  };

  if (!geo)
    return <p className="text-center py-6">Chargement de la carte…</p>;

  return (
    <div className="wrap my-12">

      <h2 className="text-3xl md:text-4xl font-bold text-sawaka-800 text-center mb-2">
        Artisans par région du Cameroun
      </h2>

      <p className="text-lg text-sawaka-600 text-center mb-6">
        Découvrez la répartition géographique des artisans
      </p>

      {/* ⭐ Légende simple */}
      <div className="flex justify-center gap-6 mb-4">
        <Legend color="#f0e5d8" label="0 artisan" />
        <Legend color="#f7c58d" label="1 artisan" />
        <Legend color="#ee9f49" label="2 artisans" />
        <Legend color="#d97904" label="3+ artisans" />
      </div>

      <MapContainer
        center={[7.3697, 12.3547]}
        zoom={7}
        scrollWheelZoom={false}
        style={{ height: "550px", width: "100%", borderRadius: "12px" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* GeoJSON simple + tooltip */}
        <GeoJSON data={geo} style={regionStyle} onEachFeature={onEachRegion} />
      </MapContainer>
    </div>
  );
}

/* Composant légende */
function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        style={{
          width: 16,
          height: 16,
          backgroundColor: color,
          border: "1px solid #555",
        }}
      ></div>
      <span className="text-sawaka-700 text-sm">{label}</span>
    </div>
  );
}
