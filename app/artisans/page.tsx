"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { listArtisans } from "@/app/lib/apiArtisans";

export default function ArtisansPage() {
  const params = useSearchParams();
  const regionParam = params.get("region"); // ← récupère ?region=

  const [artisans, setArtisans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listArtisans()
      .then((res) => setArtisans(res))
      .finally(() => setLoading(false));
  }, []);

  // Fonction de normalisation (comme dans la carte)
  const normalize = (str: string) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");

  // Si filtre par région
  const filtered = regionParam
    ? artisans.filter((a) => normalize(a.province || "") === regionParam)
    : artisans;

  return (
    <div className="wrap py-10">
      <h1 className="text-4xl font-bold text-center text-sawaka-700 mb-8">
        Les Artisans
      </h1>

      {regionParam && (
        <p className="text-center text-sawaka-600 text-lg mb-6">
          Région sélectionnée :{" "}
          <span className="font-semibold capitalize">
            {regionParam.replace("-", " ")}
          </span>
        </p>
      )}

      {loading && (
        <p className="text-center text-sawaka-600">Chargement…</p>
      )}

      {!loading && filtered.length === 0 && (
        <p className="text-center text-sawaka-600 text-lg">
          Aucun artisan trouvé pour cette région.
        </p>
      )}

      {/* LISTE */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((a) => (
          <div
            key={a._id}
            className="p-5 bg-white rounded-xl border shadow-sm"
          >
            <img
              src={a.avatarUrl || "/placeholder.jpg"}
              alt={a.firstName}
              className="w-full h-56 object-cover rounded-lg mb-3"
            />

            <h3 className="text-xl font-bold text-sawaka-800">
              {a.firstName} {a.lastName}
            </h3>

            <p className="text-sm text-sawaka-600">{a.email}</p>
            <p className="text-sm text-sawaka-500">
              Province : {a.province || "Non spécifié"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
