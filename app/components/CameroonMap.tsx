"use client";

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

// Normalisation
function normalize(str = "") {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

export default function CameroonMap() {
  const [geo, setGeo] = useState<any>(null);
  const [counts, setCounts] = useState<any>({});

  useEffect(() => {
    fetch("/maps/cameroon-regions.json")
      .then((res) => res.json())
      .then(setGeo)
      .catch(console.error);

    fetch("https://ecommerce-web-avec-tailwind.onrender.com/stats/artisans-par-region")
      .then((res) => res.json())
      .then((data) => {
        const normalizedCounts: any = {};
        Object.keys(data).forEach((k) => {
          normalizedCounts[normalize(k)] = data[k];
        });

        console.log("🗝️ Final COUNT KEYS =", Object.keys(normalizedCounts));

        setCounts(normalizedCounts);
      })
      .catch(console.error);
  }, []);

  // 🚀 FIX : on utilise UNIQUEMENT props.name
  const getRegionName = (props: any) => {
    return props?.name || "Inconnue";
  };

  const regionStyle = (feature: any) => {
    const rawName = getRegionName(feature.properties);
    const key = normalize(rawName);
    const value = counts[key] ?? 0;

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

  const onEachRegion = (feature: any, layer: any) => {
    const rawName = getRegionName(feature.properties);
    const key = normalize(rawName);
    const value = counts[key] ?? 0;

    console.log("🟦 REGION =", rawName, "| clé =", key, "| artisans =", value);

    layer.bindTooltip(`${rawName} : ${value} artisan(s)`);
  };

  if (!geo)
    return <p className="text-center py-6">Chargement de la carte…</p>;

  return (
    <div className="wrap my-12">
      <h2 className="text-3xl md:text-4xl font-bold text-sawaka-800 mb-4 text-center">
        Artisans par région du Cameroun
      </h2>

      <p className="text-lg text-sawaka-600 text-center mb-6">
        Découvrez la répartition géographique des artisans sur la plateforme
      </p>

      <MapContainer
        center={[7.3, 12.4]}
        zoom={6.3}
        scrollWheelZoom={false}
        style={{ height: "550px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />

        <GeoJSON
          data={geo}
          style={regionStyle}
          onEachFeature={onEachRegion}
        />
      </MapContainer>
    </div>
  );
}
