"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listPublicArticles } from "../lib/apiSeller";

interface Article {
  _id: string;
  title: string;
  description?: string;
  price: number;
  images?: string[];
  status?: string;
  auction?: {
    isActive?: boolean;
    highestBid?: number;
    endDate?: string;
  };
}

export default function EncheresPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEncheres = async () => {
      try {
        setLoading(true);
        setError("");
        const allArticles = await listPublicArticles();
        // ✅ Correction : on filtre uniquement sur le statut
        const encheres = allArticles.filter((a) => a.status === "auction");
        setArticles(encheres);
      } catch (err) {
        console.error("Erreur chargement enchères :", err);
        setError("Impossible de charger les ventes aux enchères.");
      } finally {
        setLoading(false);
      }
    };
    fetchEncheres();
  }, []);

  // 🕒 Formatage du temps restant
  const formatTimeLeft = (endDate?: string) => {
    if (!endDate) return "En cours...";
    const now = new Date().getTime();
    const end = new Date(endDate).getTime();
    const diff = end - now;
    if (diff <= 0) return "Terminée";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m restantes`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-sawaka-900 mb-6 flex items-center gap-2">
        🏆 <span>Ventes aux enchères</span>
      </h1>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-sawaka-600 mx-auto"></div>
          <p className="mt-4 text-sawaka-700">Chargement des articles...</p>
        </div>
      ) : error ? (
        <p className="text-red-600 text-center py-8">{error}</p>
      ) : articles.length === 0 ? (
        <p className="text-sawaka-600 text-center py-8">
          Aucune vente aux enchères active pour le moment.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {articles.map((article) => (
            <div
              key={article._id}
              className="border rounded-2xl shadow-sm hover:shadow-lg transition bg-white flex flex-col"
            >
              <div className="relative">
                <img
                  src={article.images?.[0] || "/placeholder.png"}
                  alt={article.title}
                  className="w-full h-56 object-cover rounded-t-2xl"
                />
                <div className="absolute top-2 left-2 bg-sawaka-600 text-white text-xs px-3 py-1 rounded-full">
                  Enchère
                </div>
              </div>

              <div className="p-4 flex flex-col flex-1">
                <h2 className="font-semibold text-sawaka-900 text-lg mb-2 line-clamp-2">
                  {article.title}
                </h2>

                <p className="text-sawaka-600 text-sm flex-1 mb-3 line-clamp-3">
                  {article.description || "Aucune description disponible."}
                </p>

                <div className="bg-cream-100 rounded-lg p-3 text-sm mb-3">
                  <p className="font-medium text-sawaka-800">
                    Offre actuelle :{" "}
                    <span className="text-green-700 font-bold">
                      {(article.auction?.highestBid ?? article.price).toLocaleString()} FCFA
                    </span>
                  </p>
                  <p className="text-sawaka-600 mt-1">
                    ⏰ {formatTimeLeft(article.auction?.endDate)}
                  </p>
                </div>

                <Link
                  href={`/produits/${article._id}`}
                  className="btn-primary text-center mt-auto"
                >
                  Voir le produit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
