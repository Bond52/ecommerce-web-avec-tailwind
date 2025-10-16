"use client";

import { useEffect, useState } from "react";

// 🔗 On importe la constante API de ton lib pour garder la même base URL
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

        console.log("🧾 Réponse API artisans :", data); // 🧩 debug important

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
    <main className="min-h-screen bg-amber-50 p-8">
      <h1 className="text-3xl font-bold text-center text-[#5C3A1E] mb-10">
        Nos Artisans
      </h1>

      {artisans.length === 0 ? (
        <p className="text-center text-gray-500">Aucun artisan trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {artisans.map((artisan) => (
            <div
              key={artisan._id}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition"
            >
              <img
                src={
                  artisan.idCardImage ||
                  "https://via.placeholder.com/150?text=Artisan"
                }
                alt={`${artisan.firstName || ""} ${artisan.lastName || ""}`}
                className="w-full h-40 object-cover rounded-xl mb-4"
              />
              <h2 className="text-xl font-semibold text-[#5C3A1E]">
                {artisan.firstName || artisan.lastName
                  ? `${artisan.firstName || ""} ${artisan.lastName || ""}`
                  : artisan.username}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {artisan.email || "Aucun contact"}
              </p>
              <p className="text-sm text-gray-500 mt-3 italic">
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
