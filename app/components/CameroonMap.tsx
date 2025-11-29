"use client";

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CameroonMap() {
  const router = useRouter();
  const [regions, setRegions] = useState<any>(null);

  // Charger le GeoJSON depuis /public/maps
  useEffect(() => {
    fetch("/maps/cameroon-regions.json")
      .then((res) => res.json())
      .then((data) => setRegions(data))
      .catch((err) => console.error("Erreur chargement GeoJSON :", err));
  }, []);

  // Style de base
  const regionStyle = {
    fillColor: "#c57b32",
    weight: 1,
    color: "black",
    fillOpacity: 0.4,
  };

  // Style survol
  const highlightStyle = {
    weight: 2,
    color: "#333",
    fillOpacity: 0.6,
  };

  function onEachRegion(feature: any, layer: any) {
    const regionName = feature.properties.NAME_1;

    // Tooltip simplifié
    layer.bindTooltip(regionName, { sticky: true });

    // Hover
    layer.on("mouseover", () => layer.setStyle(highlightStyle));
    layer.on("mouseout", () => layer.setStyle(regionStyle));

    // Clic → Filtrer artisans
    layer.on("click", () => {
      router.push(`/artisans?region=${encodeURIComponent(regionName)}`);
    });
  }

  return (
    <div className="flex justify-center my-8">
      <MapContainer
        center={[7.5, 12.5]}
        zoom={7}
        scrollWheelZoom={false}
        style={{ height: "600px", width: "900px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {regions && (
          <GeoJSON
            data={regions}
            style={() => regionStyle}
            onEachFeature={onEachRegion}
          />
        )}
      </MapContainer>
    </div>
  );
}
