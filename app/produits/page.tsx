"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { listPublicArticles } from "../lib/apiSeller"; // ✅ même source que la page d’accueil

interface Article {
  _id: string;
  title: string;
  description?: string;
  price: number;
  images?: string[];
}

export default function ProduitsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError("");

        // ✅ On réutilise la même logique que la page d’accueil
        const data = await listPublicArticles();

        // On limite à 12 produits "populaires" comme sur l'accueil
        setArticles(data.slice(0, 12));
        setLoading(false);
      } catch (err) {
        console.error("❌ Erreur chargement articles :", err);
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4 text-sawaka-800 text-center">
        Nos créations populaires
      </h1>
      <p className="text-center text-sawaka-600 mb-10">
        Retrouvez ici les créations artisanales les plus appréciées
      </p>

      {/* 🌀 Chargement */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sawaka-800"></div>
          <p className="mt-4 text-sawaka-600">Chargement des produits...</p>
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : articles.length === 0 ? (
        <p className="text-center text-sawaka-600">Aucun article trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {articles.map((a) => (
            <Link href={`/produits/${a._id}`} key={a._id}>
              <div className="border rounded-xl shadow hover:shadow-lg transition p-4 cursor-pointer bg-white">
                <img
                  src={a.images?.[0] || "/placeholder.png"}
                  alt={a.title}
                  className="w-full h-56 object-cover rounded-lg"
                />
                <h2 className="font-semibold mt-3 text-sawaka-800">
                  {a.title}
                </h2>
                <p className="text-gray-500">{a.price?.toLocaleString()} FCFA</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
