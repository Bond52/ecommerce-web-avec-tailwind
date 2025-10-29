"use client";

import { useEffect, useState } from "react";
import { listPublicArticles } from "../lib/apiSeller";
import Link from "next/link";

interface Article {
  _id: string;
  title: string;
  description?: string;
  price: number;
  images?: string[];
  promotion?: {
    isActive: boolean;
    discountPercent: number;
    newPrice: number;
  };
}

export default function PromotionsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        const allArticles = await listPublicArticles();
        const promos = allArticles.filter(
          (a) => a.promotion?.isActive === true
        );
        setArticles(promos);
      } catch (err) {
        console.error("Erreur chargement promotions :", err);
        setError("Impossible de charger les promotions.");
      } finally {
        setLoading(false);
      }
    };
    fetchPromotions();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-sawaka-700">
        💸 Promotions en cours
      </h1>

      {error && (
        <div className="p-3 mb-4 bg-red-50 text-red-700 border border-red-300 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <p>Chargement des promotions...</p>
      ) : articles.length === 0 ? (
        <p>Aucun article en promotion pour le moment.</p>
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

                {a.promotion?.isActive && (
                  <div className="mb-2">
                    <span className="text-sawaka-600 font-semibold">
                      {a.promotion.newPrice.toLocaleString()} FCFA
                    </span>
                    <span className="ml-2 text-sm line-through text-gray-500">
                      {a.price.toLocaleString()} FCFA
                    </span>
                    <span className="ml-2 text-xs text-white bg-sawaka-500 px-2 py-1 rounded-full">
                      -{a.promotion.discountPercent}%
                    </span>
                  </div>
                )}

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
