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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError("");

        // Vérifier que la variable d'environnement est définie
        const apiBase = process.env.NEXT_PUBLIC_API_BASE;
        if (!apiBase) {
          throw new Error("NEXT_PUBLIC_API_BASE non définie. Veuillez redémarrer le serveur Next.js après avoir créé le fichier .env.local");
        }

        console.log("🔗 Tentative de connexion à:", `${apiBase}/api/seller/public?page=${page}&limit=12`);

        const res = await fetch(
          `${apiBase}/api/seller/public?page=${page}&limit=12`,
          { credentials: "include" }
        );

        if (!res.ok) {
          throw new Error(`Erreur HTTP ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();

        // ✅ Ici on récupère les "items" depuis ton objet JSON
        const items = Array.isArray(data.items) ? data.items : [];
        setArticles(items);
        setTotalPages(data.pages || 1);
        setLoading(false);
      } catch (err) {
        console.error("❌ Erreur chargement articles :", err);
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        setLoading(false);
      }
    };

    fetchArticles();
  }, [page]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-sawaka-800">
        Tous les produits
      </h1>

      {/* Affichage des erreurs */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p className="font-bold">Erreur de connexion</p>
          <p className="text-sm">{error}</p>
          <p className="text-xs mt-2">
            Assurez-vous que:
            <br />
            1. Le fichier .env.local existe à la racine du projet
            <br />
            2. Le serveur Next.js a été redémarré (Ctrl+C puis npm run dev)
            <br />
            3. Le backend est démarré sur le port 5000
          </p>
        </div>
      )}

      {/* Affichage du chargement */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sawaka-800"></div>
          <p className="mt-4 text-sawaka-600">Chargement des produits...</p>
        </div>
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
                <h2 className="font-semibold mt-3 text-sawaka-800">{a.title}</h2>
                <p className="text-gray-500">
                  {a.price?.toLocaleString()} FCFA
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination - seulement si pas d'erreur et pas de chargement */}
      {!loading && !error && articles.length > 0 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-sawaka-50 transition"
          >
            ◀ Précédent
          </button>
          <span className="px-4 py-2">
            Page {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-sawaka-50 transition"
          >
            Suivant ▶
          </button>
        </div>
      )}
    </div>
  );
}
