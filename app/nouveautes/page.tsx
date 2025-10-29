"use client";

import { useEffect, useState } from "react";
import { listPublicArticles } from "../lib/apiSeller";
import Link from "next/link";
import { siteConfig } from "../config/siteConfig";

interface Article {
  _id: string;
  title: string;
  description?: string;
  price: number;
  createdAt?: string;
  images?: string[];
}

export default function NouveautesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNouveautes = async () => {
      try {
        setLoading(true);
        const allArticles = await listPublicArticles();

        let filtered: Article[] = [];

        if (siteConfig.nouveautes.useLimitMode) {
          // 🔢 Mode "X derniers articles"
          filtered = allArticles
            .sort(
              (a, b) =>
                new Date(b.createdAt ?? 0).getTime() -
                new Date(a.createdAt ?? 0).getTime()
            )
            .slice(0, siteConfig.nouveautes.limit);
        } else {
          // 🕒 Mode "articles créés depuis Y jours/heures"
          const now = new Date();
          const cutoff = new Date(
            now.getTime() -
              (siteConfig.nouveautes.recentDays * 24 * 60 * 60 * 1000 +
                siteConfig.nouveautes.recentHours * 60 * 60 * 1000)
          );
          filtered = allArticles.filter(
            (a) => new Date(a.createdAt ?? 0) >= cutoff
          );
        }

        setArticles(filtered);
      } catch (err) {
        console.error("Erreur chargement nouveautés :", err);
        setError("Impossible de charger les nouveautés.");
      } finally {
        setLoading(false);
      }
    };
    fetchNouveautes();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-sawaka-700">
        🆕 Nouveautés
      </h1>

      {error && (
        <div className="p-3 mb-4 bg-red-50 text-red-700 border border-red-300 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <p>Chargement des nouveautés...</p>
      ) : articles.length === 0 ? (
        <p>Aucune nouveauté pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {articles.map((a) => (
            <div
              key={a._id}
              className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all bg-white"
            >
              <img
                src={a.images?.[0] || "/images/placeholder.png"}
                alt={a.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{a.title}</h3>
                <div className="text-sawaka-600 font-medium">
                  {a.price.toLocaleString()} FCFA
                </div>
                <Link
                  href={`/produit/${a._id}`}
                  className="inline-block mt-2 text-sm text-sawaka-700 hover:underline"
                >
                  Voir le produit →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
