"use client";

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

// Normalisation robuste
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
    // Charger le GeoJSON local
    fetch("/maps/cameroon-regions.json")
      .then((res) => res.json())
      .then(setGeo)
      .catch(console.error);

    // Charger les stats
    fetch("https://ecommerce-web-avec-tailwind.onrender.com/stats/artisans-par-region")
      .then((res) => res.json())
      .then((data) => {

        // Normaliser toutes les clés reçues du backend
        const normalizedCounts: any = {};
        Object.keys(data).forEach((k) => {
          normalizedCounts[normalize(k)] = data[k];
        });

        setCounts(normalizedCounts);
      })
      .catch(console.error);
  }, []);

  // Extraction du nom correct depuis le GeoJSON
  const getRegionName = (props: any) => {
    return props?.NAME_1 || props?.name || props?.region || "Inconnue";
  };

  // Style selon nb artisans
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

  // Tooltip + DEBUG sécurisé
  const onEachRegion = (feature: any, layer: any) => {
    const rawName = getRegionName(feature.properties);

    const name1 = feature.properties?.NAME_1 || "";  // string safe

    console.log("🟩 RAW PROPS:", feature.properties);
    console.log("🔤 RAW NAME_1:", name1);

    if (name1) {
      console.log("🧩 CODEPOINTS:", [...name1].map((c) => c.charCodeAt(0)));
      console.log("🧼 NORMALIZED:", normalize(name1));
    } else {
      console.log("⚠️ NAME_1 ABSENT");
    }

    const key = normalize(rawName);
    const value = counts[key] ?? 0;

    console.log("🟦 REGION =", rawName, "| clé =", key, "| artisans =", value);

    layer.bindTooltip(`${rawName} : ${value} artisan(s)`, {
      permanent: false,
      sticky: true,
    });
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
