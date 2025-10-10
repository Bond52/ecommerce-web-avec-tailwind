"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Article {
  _id: string;
  title: string;
  description?: string;
  price: number;
  images?: string[];
}

export default function ProduitsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/seller/public?page=${page}&limit=12`,
          { credentials: "include" }
        );

        const data = await res.json();

        // ✅ Ici on récupère les "items" depuis ton objet JSON
        const items = Array.isArray(data.items) ? data.items : [];
        setArticles(items);
        setTotalPages(data.pages || 1);
      } catch (err) {
        console.error("Erreur chargement articles :", err);
      }
    };

    fetchArticles();
  }, [page]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-sawaka-800">
        Tous les produits
      </h1>

      {articles.length === 0 ? (
        <p className="text-center text-sawaka-600">Aucun article trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {articles.map((a) => (
            <Link href={`/produit/${a._id}`} key={a._id}>
              <div className="border rounded-xl shadow hover:shadow-lg transition p-4 cursor-pointer bg-white">
                <img
                  src={a.images?.[0] || "/placeholder.png"}
                  alt={a.title}
                  className="w-full h-56 object-cover rounded-lg"
                />
                <h2 className="font-semibold mt-3 text-sawaka-800">{a.title}</h2>
                <p className="text-gray-500">
                  {a.price?.toLocaleString()} FCFA
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="flex justify-center gap-2 mt-8">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          ◀ Précédent
        </button>
        <span className="px-4 py-2">
          Page {page} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Suivant ▶
        </button>
      </div>
    </div>
  );
}
