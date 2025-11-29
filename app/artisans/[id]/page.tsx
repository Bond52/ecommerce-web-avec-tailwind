"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Mail, Phone, MapPin, User } from "lucide-react";
import { getArtisan, Artisan } from "@/app/lib/apiArtisans";

export default function ArtisanDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    getArtisan(id as string)
      .then(setArtisan)
      .catch(() => setArtisan(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-sawaka-700">Chargement...</p>
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl font-bold mb-2">Artisan introuvable</h2>
        <button
          onClick={() => router.push("/artisans")}
          className="btn-primary mt-4"
        >
          Retour
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-cream-100 p-6">
      <button
        onClick={() => router.push("/artisans")}
        className="flex items-center gap-2 text-sawaka-700 hover:text-sawaka-900 mb-6"
      >
        <ArrowLeft size={20} /> Retour
      </button>

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-cream-200">

        {/* PHOTO */}
        <div className="flex flex-col items-center mb-6">
          
<img
  src={
    artisan.avatarUrl ||
    "https://via.placeholder.com/200x150?text=Artisan"
  }
  alt="artisan"
  className="w-48 h-48 object-cover rounded-xl border border-cream-300 shadow"
/>




          <h1 className="mt-4 text-3xl font-bold text-sawaka-900">
            {artisan.firstName} {artisan.lastName}
          </h1>
          <p className="text-sawaka-700">{artisan.username}</p>
        </div>

        {/* INFO */}
        <div className="space-y-4">
          {artisan.email && (
            <p className="flex items-center gap-2 text-sawaka-800">
              <Mail size={18} /> {artisan.email}
            </p>
          )}

          {artisan.phone && (
            <p className="flex items-center gap-2 text-sawaka-800">
              <Phone size={18} /> {artisan.phone}
            </p>
          )}

          {(artisan.city || artisan.province) && (
            <p className="flex items-center gap-2 text-sawaka-800">
              <MapPin size={18} /> {artisan.city}, {artisan.province}
            </p>
          )}

          {artisan.commerceName && (
            <p className="flex items-center gap-2 text-sawaka-800">
              <User size={18} /> Commerce : {artisan.commerceName}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
