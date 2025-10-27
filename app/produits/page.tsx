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
}

export default function ProduitsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await listPublicArticles();
        setArticles(data.slice(0, 12));
      } catch (err) {
        console.error("❌ Erreur chargement articles :", err);
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-2 text-sawaka-800 text-center">
        Tous les produits
      </h1>
      <p className="text-center text-sawaka-600 mb-10">
        Découvrez les créations artisanales authentiques de nos vendeurs
      </p>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sawaka-800"></div>
          <p className="mt-4 text-sawaka-600">Chargement des produits...</p>
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : articles.length === 0 ? (
        <p className="text-center text-sawaka-600">
          Aucun article n’est disponible pour le moment.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {articles.map((a) => (
            <Link href={`/produits/${a._id}`} key={a._id}>
              <div className="group bg-white rounded-2xl border border-cream-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer">
                {/* Image du produit */}
                <div className="relative aspect-square bg-cream-100 overflow-hidden">
                  <img
                    src={a.images?.[0] || "/placeholder.png"}
                    alt={a.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Contenu de la carte */}
                <div className="p-5">
                  <h2 className="text-xl font-bold text-sawaka-800 mb-1 group-hover:text-sawaka-600 transition-colors">
                    {a.title}
                  </h2>
                  <p className="text-sawaka-600 text-sm mb-3 line-clamp-2">
                    {a.description || "Article artisanal unique"}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-semibold text-sawaka-800">
                      {a.price?.toLocaleString()}{" "}
                      <span className="text-sm font-medium">FCFA</span>
                    </span>

                    <button
                      className="bg-sawaka-500 hover:bg-sawaka-600 text-white text-sm px-3 py-2 rounded-lg transition-all"
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`🛍️ "${a.title}" ajouté au panier`);
                      }}
                    >
                      🛒 Ajouter
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
