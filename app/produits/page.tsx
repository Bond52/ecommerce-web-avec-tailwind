"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProduitsPage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?page=${page}&limit=12`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setTotalPages(data.totalPages || 1);
      })
      .catch((err) => console.error("Erreur chargement produits :", err));
  }, [page]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Tous les produits</h1>

      {/* 🔹 Liste des produits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <Link href={`/produit/${p._id}`} key={p._id}>
            <div className="border rounded-xl shadow hover:shadow-lg transition p-4 cursor-pointer">
              <img
                src={p.image}
                alt={p.title}
                className="w-full h-56 object-cover rounded-lg"
              />
              <h2 className="font-semibold mt-3">{p.title}</h2>
              <p className="text-gray-500">${p.price}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* 🔹 Pagination */}
      <div className="flex justify-center gap-2 mt-8">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          ◀ Précédent
        </button>
        <span className="px-4 py-2">Page {page} / {totalPages}</span>
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
