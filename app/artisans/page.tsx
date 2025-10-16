"use client";

import { useEffect, useState } from "react";

interface Artisan {
  _id: string;
  name?: string;
  username?: string;
  email?: string;
  profilePicture?: string;
  createdAt?: string;
}

export default function ArtisansPage() {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/artisans`);
        const data = await res.json();
        setArtisans(data);
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
                  artisan.profilePicture ||
                  "https://via.placeholder.com/150?text=Artisan"
                }
                alt={artisan.name || artisan.username || "Artisan"}
                className="w-full h-40 object-cover rounded-xl mb-4"
              />
              <h2 className="text-xl font-semibold text-[#5C3A1E]">
                {artisan.name || artisan.username}
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
