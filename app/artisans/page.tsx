"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// API
const API =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "https://ecommerce-web-avec-tailwind.onrender.com";

interface Artisan {
  _id: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;   // ✅ Ajout pour la photo Cloudinary
  idCardImage?: string;
  createdAt?: string;
  isSeller?: boolean;
  roles?: string[];
  commerceName?: string;
  city?: string;
  province?: string;
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
        Les Artisans
      </h1>

      {artisans.length === 0 ? (
        <p className="text-center text-gray-600">Aucun artisan trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {artisans.map((artisan) => (
            <Link
              key={artisan._id}
              href={`/artisans/${artisan._id}`}
              className="bg-white p-6 rounded-2xl shadow-md border border-cream-200 hover:shadow-lg transition block"
            >
              {/* IMAGE */}
<img
  src={
    artisan.avatarUrl ||
    "https://via.placeholder.com/200x150?text=Artisan"
  }
  alt="artisan"
  className="w-48 h-48 object-cover rounded-xl border border-cream-300 shadow"
/>

              {/* TEXTES */}
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
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
