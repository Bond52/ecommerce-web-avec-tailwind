"use client";

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CameroonMap() {
  const router = useRouter();
  const [regions, setRegions] = useState<any>(null);

  // Charger GeoJSON depuis /public/maps
  useEffect(() => {
    fetch("/maps/cameroon-regions.json")
      .then((res) => res.json())
      .then((data) => setRegions(data))
      .catch((err) => console.error("Erreur chargement GeoJSON :", err));
  }, []);

  // Style par défaut
  const regionStyle = {
    fillColor: "#c57b32",
    weight: 1,
    color: "black",
    fillOpacity: 0.4,
  };

  // Survol
  const highlightStyle = {
    weight: 2,
    color: "#333",
    fillOpacity: 0.6,
  };

  function onEachRegion(feature: any, layer: any) {
    const name = feature.properties.NAME_1;

    layer.bindTooltip(name, { sticky: true });

    layer.on("mouseover", () => layer.setStyle(highlightStyle));
    layer.on("mouseout", () => layer.setStyle(regionStyle));

    layer.on("click", () => {
      router.push(`/artisans?region=${encodeURIComponent(name)}`);
    });
  }

  return (
    <div className="w-full flex justify-center my-12">
      <div className="w-full max-w-6xl"> 
        <MapContainer
          center={[7.5, 12.5]}
          zoom={7}
          scrollWheelZoom={false}
          style={{
            height: "650px",      // ← hauteur restaurée
            width: "100%",        // ← largeur contrôlée
            borderRadius: "12px", // optionnel
            overflow: "hidden",
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
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
    </div>
  );
}
