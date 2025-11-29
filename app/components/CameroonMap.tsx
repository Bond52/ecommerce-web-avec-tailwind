"use client";

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import cameroonRegions from "@/public/maps/cameroon-regions.json"; 
import { useRouter } from "next/navigation";

export default function CameroonMap() {
  const router = useRouter();

  /** 🎨 STYLE NORMAL */
  const regionStyle = {
    fillColor: "#d6a05e", // couleur d’origine
    color: "#000",
    weight: 1,
    fillOpacity: 0.45,
  };

  /** 🎨 STYLE SURVOL */
  const highlightStyle = {
    weight: 2,
    color: "#333",
    fillOpacity: 0.65,
  };

  /** 🧠 Gestion des interactions par région */
  function onEachRegion(feature: any, layer: any) {
    const regionName = feature.properties.NAME_1;

    /** 🔍 Tooltip : nom uniquement */
    layer.bindTooltip(regionName, {
      sticky: true,
      className: "region-tooltip",
    });

    /** ✨ Survol */
    layer.on("mouseover", function () {
      layer.setStyle(highlightStyle);
    });

    layer.on("mouseout", function () {
      layer.setStyle(regionStyle);
    });

    /** 👆 Click vers artisans filtrés */
    layer.on("click", function () {
      router.push(`/artisans?region=${encodeURIComponent(regionName)}`);
    });
  }

  return (
    <div className="w-full flex justify-center my-10">
      <div className="w-full max-w-6xl">
        <MapContainer
          center={[7.4, 12.5]}       // ← ton ancien centrage
          zoom={7}                   // ← ton ancien zoom
          scrollWheelZoom={true}
          style={{
            height: "650px",         // ← hauteur restaurée
            width: "100%",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />

          <GeoJSON
            data={cameroonRegions as any}
            style={() => regionStyle}
            onEachFeature={onEachRegion}
          />
        </MapContainer>
      </div>
    </div>
  );
}
