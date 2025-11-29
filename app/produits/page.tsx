"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { listPublicArticles } from "../lib/apiSeller";
import type { Article } from "../lib/apiSeller";


export default function ProduitsPage() {
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [paginatedArticles, setPaginatedArticles] = useState<Article[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const ITEMS_PER_PAGE = 12;

  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const currentPage = Number(searchParams.get("page")) || 1;

  // ─────────────────────────────────────────────
  // 🔍 Chargement + filtrage + pagination réelle
  // ─────────────────────────────────────────────
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await listPublicArticles();

        // 1) FILTRAGE
        let filtered = data;
        if (categoryParam) {
          const norm = categoryParam.toLowerCase();
          filtered = data.filter((a: Article) =>
            a.categories?.some((c) => c.toLowerCase().includes(norm))
          );
        }

        setAllArticles(filtered);

        // 2) PAGINATION RÉELLE
        const total = filtered.length;
        const pages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
        setTotalPages(pages);

        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const sliced = filtered.slice(start, start + ITEMS_PER_PAGE);

        setPaginatedArticles(sliced);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [categoryParam, currentPage]);

  // ─────────────────────────────────────────────
  // 🏷️ Catégorie affichée
  // ─────────────────────────────────────────────
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
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sawaka-800" />
          <p className="mt-4 text-sawaka-600">Chargement des produits...</p>
        </div>
      )}

      {/* Erreur */}
      {!loading && error && (
        <p className="text-center text-red-500">{error}</p>
      )}

      {/* Aucun article */}
      {!loading && !error && paginatedArticles.length === 0 && (
        <p className="text-center text-sawaka-600">
          Aucun article trouvé dans cette catégorie.
        </p>
      )}

      {/* Grille produits */}
      {!loading && !error && paginatedArticles.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {paginatedArticles.map((a) => (
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
                      {a.description}
                    </p>

                    <span className="text-2xl font-semibold text-sawaka-800">
                      {a.price.toLocaleString()}{" "}
                      <span className="text-sm font-medium">FCFA</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-10 space-x-2">
            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              const url = categoryParam
                ? `/produits?category=${categoryParam}&page=${page}`
                : `/produits?page=${page}`;

              return (
                <Link
                  key={page}
                  href={url}
                  className={`px-4 py-2 rounded-lg border text-sm ${
                    page === currentPage
                      ? "bg-sawaka-600 text-white border-sawaka-600"
                      : "bg-white text-sawaka-800 border-cream-300 hover:bg-cream-100"
                  }`}
                >
                  {page}
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
