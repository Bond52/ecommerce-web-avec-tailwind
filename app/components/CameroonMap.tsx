"use client";

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

export default function CameroonMap() {
  const [geo, setGeo] = useState<any>(null);
  const [counts, setCounts] = useState<any>({});

  // Correspondance GeoJSON → noms des régions en français
  const REGION_MAP: Record<string, string> = {
    "Centre": "Centre",
    "Littoral": "Littoral",
    "West": "Ouest",
    "North-West": "Nord-Ouest",
    "South-West": "Sud-Ouest",
    "Far-North": "Extrême-Nord",
    "North": "Nord",
    "Adamawa": "Adamaoua",
    "East": "Est",
    "South": "Sud"
  };

  // Charger GeoJSON + statistiques
  useEffect(() => {
    fetch("/maps/cm.json")
      .then((res) => res.json())
      .then(setGeo)
      .catch(console.error);

    fetch("https://ecommerce-web-avec-tailwind.onrender.com/stats/artisans-par-region")
      .then((res) => res.json())
      .then(setCounts)
      .catch(console.error);
  }, []);

  // Style dynamique des régions
  const regionStyle = (feature: any) => {
    const raw = feature.properties.region || feature.properties.name;
    const regionName = REGION_MAP[raw] || raw;
    const value = counts[regionName] || 0;

    const color =
      value === 0 ? "#f0e5d8" :
      value === 1 ? "#f7c58d" :
      value === 2 ? "#ee9f49" :
      "#d97904";

    return {
      fillColor: color,
      weight: 1.2,
      opacity: 1,
      color: "#8a5500",
      fillOpacity: 0.7,
    };
  };

  // Tooltip (inclus dans chaque région)
  const onEachRegion = (feature: any, layer: any) => {
    const raw = feature.properties.region || feature.properties.name;
    const regionName = REGION_MAP[raw] || raw;
    const value = counts[regionName] || 0;

    layer.bindTooltip(
      `${regionName} : ${value} artisan(s)`,
      { sticky: true }
    );
  };

  if (!geo) return <p className="text-center py-6">Chargement de la carte…</p>;

  return (
    <div className="wrap my-10">
      <h2 className="text-3xl md:text-4xl font-bold text-sawaka-800 mb-2 text-center">
        Artisans par région du Cameroun
      </h2>
      <p className="text-lg text-sawaka-600 max-w-2xl mx-auto text-center mb-6">
        Découvrez la répartition géographique des artisans sur la plateforme
      </p>

      {/* Légende */}
      <div className="flex justify-center gap-6 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 rounded" style={{ background: "#f0e5d8" }}></span>
          0 artisan
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 rounded" style={{ background: "#f7c58d" }}></span>
          1 artisan
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 rounded" style={{ background: "#ee9f49" }}></span>
          2 artisans
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 rounded" style={{ background: "#d97904" }}></span>
          3+ artisans
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto border rounded-xl overflow-hidden shadow-lg">
        <MapContainer
          center={[7.5, 12.5]}
          zoom={7}
          scrollWheelZoom={false}
          style={{ height: "550px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          <GeoJSON data={geo} style={regionStyle} onEachFeature={onEachRegion} />
        </MapContainer>
      </div>
    </div>
  );
}
