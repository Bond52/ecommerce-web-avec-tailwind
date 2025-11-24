"use client";

import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

export default function CameroonMap() {
  const [geo, setGeo] = useState<any>(null);
  const [counts, setCounts] = useState<any>({});

  // Charger GeoJSON + données backend
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

  // Couleurs
  const regionStyle = (feature: any) => {
    const name =
      feature.properties?.region ?? feature.properties?.name ?? "??";

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

  // Hook pour centrer sur le Cameroun
  function AutoCenter() {
    const map = useMap();

    useEffect(() => {
      map.setView([7.3697, 12.3547], 7); // centre + zoom parfaits
    }, [map]);

    return null;
  }

  // Tooltip + Label
  const onEachRegion = (feature: any, layer: L.Layer) => {
    const name =
      feature.properties?.region ?? feature.properties?.name ?? "Région";
    const value = counts[name] || 0;

    // Tooltip
    layer.bindTooltip(
      `${name} : ${value} artisan(s)`,
      { sticky: true, direction: "top" }
    );

    // Label : utiliser "layer.getBounds()" → UNIQUEMENT si le layer est bien un Polygon
    if ((layer as any).getBounds) {
      const center = (layer as any).getBounds().getCenter();

      const labelIcon = L.divIcon({
        className: "region-label",
        html: `
          <div style="
            font-size:14px;
            font-weight:bold;
            background:white;
            padding:2px 5px;
            border-radius:4px;
            border:1px solid #aaa;
          ">
            ${name}
          </div>
        `,
      });

      L.marker(center, {
        icon: labelIcon,
        interactive: false,
      }).addTo((layer as any)._eventParents[Object.keys((layer as any)._eventParents)[0]]);
    }
  };

  if (!geo)
    return <p className="text-center py-6">Chargement de la carte…</p>;

  return (
    <div className="wrap my-12">
      <h2 className="text-3xl md:text-4xl font-bold text-sawaka-800 mb-4 text-center">
        Artisans par région du Cameroun
      </h2>
      <p className="text-lg text-sawaka-600 max-w-2xl mx-auto text-center mb-6">
        Répartition géographique des artisans
      </p>

      {/* Légende */}
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
        <AutoCenter />

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <GeoJSON data={geo} style={regionStyle} onEachFeature={onEachRegion} />
      </MapContainer>
    </div>
  );
}

/* Légende */
function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        style={{
          width: 18,
          height: 18,
          backgroundColor: color,
          border: "1px solid #666",
        }}
      ></div>
      <span className="text-sawaka-700 text-sm">{label}</span>
    </div>
  );
}
