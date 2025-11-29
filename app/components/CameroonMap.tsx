"use client";

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

/* ============================================================
   🧹 Normalisation des noms de région (anti-espace / anti-accent)
=============================================================== */
function normalizeRegion(str: string = "") {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // retire accents
    .replace(/\s+/g, " ")            // espaces multiples
    .trim()                           // retire espaces début/fin
    .toLowerCase();                   // casse uniforme
}

export default function CameroonMap() {
  const [geo, setGeo] = useState<any>(null);
  const [counts, setCounts] = useState<any>({});

  // Charger GeoJSON + stats
  useEffect(() => {
    // ▼ Charger le fichier GeoJSON local
    fetch("/maps/cameroon-regions.json")
      .then((res) => res.json())
      .then(setGeo)
      .catch(console.error);

    // ▼ Récupérer les stats backend
    fetch("https://ecommerce-web-avec-tailwind.onrender.com/stats/artisans-par-region")
      .then((res) => res.json())
      .then((data) => {
        console.log("📌 STATISTIQUES RECUES:", data);

        // Normalisation des clés (ex : "Sud" → "sud")
        const normalized: any = {};
        Object.keys(data).forEach((key) => {
          normalized[normalizeRegion(key)] = data[key];
        });

        console.log("📌 NORMALISE:", normalized);
        setCounts(normalized);
      })
      .catch(console.error);
  }, []);

  /* ============================================================
     🎨 Style selon le nombre d’artisans
  =============================================================== */
  const regionStyle = (feature: any) => {
    const rawName =
      feature.properties?.region || feature.properties?.name;

    const name = normalizeRegion(rawName);

    const value = counts[name] ?? 0;

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

  /* ============================================================
     🏷️ Tooltip
  =============================================================== */
  const onEachRegion = (feature: any, layer: any) => {
    const rawName =
      feature.properties?.region || feature.properties?.name;

    const name = normalizeRegion(rawName);

    const value = counts[name] ?? 0;

    layer.bindTooltip(
      `${rawName} : ${value} artisan(s)`,
      { permanent: false, sticky: true }
    );
  };

  if (!geo)
    return <p className="text-center py-6">Chargement de la carte…</p>;

  return (
    <div className="wrap my-12">

      {/* ===== Titre ===== */}
      <h2 className="text-3xl md:text-4xl font-bold text-sawaka-800 mb-4 text-center">
        Artisans par région du Cameroun
      </h2>

      <p className="text-lg text-sawaka-600 text-center mb-6">
        Découvrez la répartition géographique des artisans sur la plateforme
      </p>

      {/* ===== Légende ===== */}
      <div className="flex justify-center gap-6 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <span style={{ width: 20, height: 20, background: "#f0e5d8", border: "1px solid #aaa" }}></span> 0 artisan
        </div>
        <div className="flex items-center gap-2">
          <span style={{ width: 20, height: 20, background: "#f7c58d", border: "1px solid #aaa" }}></span> 1 artisan
        </div>
        <div className="flex items-center gap-2">
          <span style={{ width: 20, height: 20, background: "#ee9f49", border: "1px solid #aaa" }}></span> 2 artisans
        </div>
        <div className="flex items-center gap-2">
          <span style={{ width: 20, height: 20, background: "#d97904", border: "1px solid #aaa" }}></span> 3+ artisans
        </div>
      </div>

      {/* ===== Carte ===== */}
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
