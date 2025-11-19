"use client";

import { useEffect, useState } from "react";

// 🔗 API
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
        console.error("Erreur lors du chargement des artisans :", error);
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
    <main className="min-h-screen bg-cream-100 px-6 py-12">
      <h1 className="text-4xl font-bold text-center text-sawaka-800 mb-12">
        Nos Artisans
      </h1>

      {artisans.length === 0 ? (
        <p className="text-center text-gray-500">Aucun artisan trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {artisans.map((artisan) => (
            <div
              key={artisan._id}
              className="bg-white p-6 rounded-2xl shadow-md border border-cream-200 hover:shadow-lg transition"
            >
              <img
                src={
                  artisan.idCardImage ||
                  "/images/profile-placeholder.png"
                }
                alt={`${artisan.firstName || ""} ${artisan.lastName || ""}`}
                className="w-full h-40 object-cover rounded-xl border border-cream-300"
              />

              <h2 className="text-xl font-semibold text-sawaka-800 mt-4">
                {artisan.firstName || artisan.lastName
                  ? `${artisan.firstName || ""} ${artisan.lastName || ""}`
                  : artisan.username || "Artisan"}
              </h2>

              <p className="text-sm text-gray-600 mt-1">
                {artisan.email || "Aucun contact"}
              </p>

              <p className="text-sm text-gray-500 mt-4 italic">
                Inscrit depuis{" "}
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
