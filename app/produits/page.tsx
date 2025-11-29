"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

import { listPublicArticles } from "../lib/apiSeller";
import type { Article } from "../lib/apiSeller";

// Nombre d’articles par page
const PAGE_SIZE = 12;

export default function ProduitsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();

  // Paramètre de catégorie
  const categoryParam = searchParams.get("category");

  // Permet de changer d’URL à chaque changement de page
  const updatePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/produits?${params.toString()}`);
  };

  // Charge la page courante depuis l’URL
  useEffect(() => {
    const p = Number(searchParams.get("page") || "1");
    setPage(p);
  }, [searchParams]);

  // Chargement des articles
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await listPublicArticles();

        let items = data || [];

        // Filtre catégorie
        if (categoryParam) {
          const norm = categoryParam.toLowerCase();
          items = items.filter((a) =>
            a.categories?.some((c) => c.toLowerCase().includes(norm))
          );
        }

        setTotal(items.length);

        // Pagination locale
        const start = (page - 1) * PAGE_SIZE;
        const paginated = items.slice(start, start + PAGE_SIZE);

        setArticles(paginated);
      } catch (err) {
        console.error("❌ Erreur chargement articles :", err);
        setError("Impossible de charger les articles.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [categoryParam, page]);

  // Titre catégorie
  const categoryTitle = (() => {
    if (!categoryParam) return "Tous les produits";
    switch (categoryParam.toLowerCase()) {
      case "mode":
        return "Mode & Accessoires";
      case "maison":
        return "Maison & Décoration";
      case "art":
        return "Art & Artisanat";
      case "beaute":
        return "Beauté & Bien-être";
      case "bijoux":
        return "Bijoux";
      case "textile":
        return "Textile";
      default:
        return "Produits";
    }
  })();

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-2 text-sawaka-800 text-center">
        {categoryTitle}
      </h1>
      <p className="text-center text-sawaka-600 mb-10">
        {categoryParam
          ? `Découvrez les articles de la catégorie ${categoryTitle}`
          : "Découvrez les créations artisanales authentiques"}
      </p>

      {/* Loading */}
      {loading && (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sawaka-800"></div>
          <p className="mt-4 text-sawaka-600">Chargement des produits...</p>
        </div>
      )}

      {/* Erreur */}
      {!loading && error && <p className="text-center text-red-500">{error}</p>}

      {/* Aucun résultat */}
      {!loading && !error && articles.length === 0 && (
        <p className="text-center text-sawaka-600">
          Aucun article trouvé dans cette catégorie.
        </p>
      )}

      {/* Grille */}
      {!loading && !error && articles.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-10">
            {articles.map((a) => (
              <Link href={`/produits/${a._id}`} key={a._id}>
                <div className="group bg-white rounded-2xl border border-cream-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer">

                  <div className="relative aspect-square bg-cream-100 overflow-hidden">
                    <img
                      src={a.images?.[0] || "/placeholder.png"}
                      alt={a.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

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
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {/* Précédent */}
              <button
                disabled={page <= 1}
                onClick={() => updatePage(page - 1)}
                className={`px-4 py-2 rounded-lg border ${
                  page <= 1
                    ? "opacity-40 cursor-not-allowed"
                    : "bg-white hover:bg-cream-200"
                }`}
              >
                ◀ Précédent
              </button>

              {/* Pages */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => updatePage(p)}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    p === page
                      ? "bg-sawaka-500 text-white"
                      : "bg-white hover:bg-cream-200"
                  }`}
                >
                  {p}
                </button>
              ))}

              {/* Suivant */}
              <button
                disabled={page >= totalPages}
                onClick={() => updatePage(page + 1)}
                className={`px-4 py-2 rounded-lg border ${
                  page >= totalPages
                    ? "opacity-40 cursor-not-allowed"
                    : "bg-white hover:bg-cream-200"
                }`}
              >
                Suivant ▶
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
