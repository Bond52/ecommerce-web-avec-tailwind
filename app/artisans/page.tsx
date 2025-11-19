"use client";

import { useEffect, useState } from "react";

// API
const API =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_BACKEND_URL) ||
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE) ||
  "https://ecommerce-web-avec-tailwind.onrender.com";

interface Artisan {
  _id: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  idCardImage?: string;
  createdAt?: string;
  isSeller?: boolean;
  roles?: string[];
}

export default function ArtisansPage() {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        const res = await fetch(`${API}/api/artisans`, { cache: "no-store" });
        const data = await res.json();

        const filtered = data.filter(
          (a: Artisan) => a.isSeller === true || a.roles?.includes("vendeur")
        );
        setArtisans(filtered);
      } catch (error) {
        console.error("Erreur lors du chargement :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtisans();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-600">
        Chargement des artisans...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-cream-100 p-8">
      <h1 className="text-3xl font-bold text-center text-sawaka-900 mb-10">
        Nos Artisans
      </h1>

      {artisans.length === 0 ? (
        <p className="text-center text-gray-600">Aucun artisan trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {artisans.map((artisan) => (
            <div
              key={artisan._id}
              className="bg-white p-6 rounded-2xl shadow-md border border-cream-200 hover:shadow-lg transition"
            >
              {/* IMAGE EN HAUT GAUCHE — GRANDE */} 
              <img
                src={
                  artisan.idCardImage ||
                  "https://via.placeholder.com/300x200?text=Artisan"
                }
                alt={`${artisan.firstName} ${artisan.lastName}`}
                className="w-full h-48 object-cover rounded-xl"
              />

              {/* TEXTES EN BAS */}
              <h2 className="mt-4 text-xl font-semibold text-sawaka-900">
                {artisan.firstName || artisan.lastName
                  ? `${artisan.firstName || ""} ${artisan.lastName || ""}`
                  : artisan.username}
              </h2>

              <p className="text-sm text-gray-700 mt-1">
                {artisan.email || "Email indisponible"}
              </p>

              <p className="text-sm mt-3 italic text-gray-500">
                Inscrit depuis le{" "}
                {artisan.createdAt
                  ? new Date(artisan.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
