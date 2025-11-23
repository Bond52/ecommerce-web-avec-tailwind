"use client";

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

export default function CameroonMap() {
  const [geo, setGeo] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch("/maps/cameroon-regions.json")
      .then((res) => res.json())
      .then(setGeo)
      .catch(console.error);

    fetch("https://backend-sawaka.onrender.com/stats/artisans-par-region")
      .then((res) => res.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  const getColor = (count: number) => {
    if (count > 20) return "#8b0000"; // rouge foncé
    if (count > 10) return "#c0392b"; // rouge
    if (count > 5) return "#e67e22";  // orange
    if (count > 0) return "#f1c40f";  // jaune
    return "#ecf0f1";                // gris clair
  };

  const style = (feature: any) => {
    const regionName = feature.properties.name;
    const count = stats?.[regionName] || 0;

    return {
      fillColor: getColor(count),
      weight: 1,
      opacity: 1,
      color: "#555",
      fillOpacity: 0.7,
    };
  };

  if (!geo || !stats)
    return <p className="text-center py-6">Chargement de la carte…</p>;

  return (
    <div className="wrap my-16">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-sawaka-800 mb-4">
        Artisans par région du Cameroun
      </h2>
      <p className="text-lg text-sawaka-600 max-w-2xl mx-auto text-center mb-8">
        Découvrez la répartition géographique des artisans sur la plateforme
      </p>

      <MapContainer
        center={[7.3697, 12.3547]}
        zoom={6}
        scrollWheelZoom={false}
        className="cameroon-map"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <GeoJSON data={geo} style={style} />
      </MapContainer>
    </div>
  );
}
