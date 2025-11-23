"use client";

import { useState } from "react";

export default function ArbrePage() {
  const [query, setQuery] = useState("");

  // 🔧 Catalogue fictif des outils
  const tools = [
    {
      name: "Petite scie artisanale",
      vendor: "Boutique Bois&Bambou",
      price: "4 500 FCFA",
    },
    {
      name: "Mini-perceuse manuelle",
      vendor: "Atelier TechnoCraft",
      price: "12 000 FCFA",
    },
    {
      name: "Cutter de précision",
      vendor: "Art & Design Shop",
      price: "2 000 FCFA",
    },
    {
      name: "Tige en bois pour axe",
      vendor: "ÉcoRécup Village",
      price: "500 FCFA",
    },
    {
      name: "Roue en bois pré-taillée",
      vendor: "DécoBois Douala",
      price: "2 800 FCFA",
    },
    {
      name: "Machine CNC artisanale",
      vendor: null, // ❗ Aucun fabricant !
      price: null,
    },
  ];

  const filtered = tools.filter((t) =>
    t.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="wrap py-12">
      <h1 className="text-3xl font-bold text-sawaka-700 mb-4">
        L’Arbre à Outils
      </h1>

      <p className="text-sawaka-700 text-lg leading-relaxed max-w-2xl mb-8">
        Cette section vous donnera accès aux outils nécessaires ainsi qu’aux vendeurs
        locaux qui les proposent pour soutenir vos projets — artisanaux ou industriels.
        <br /><br />
        Lorsqu’aucun fabricant national n’existe pour un outil, cela révèle une
        opportunité de création locale !
      </p>

      {/* 🔍 Barre de recherche */}
      <div className="max-w-lg mb-8">
        <input
          type="text"
          placeholder="Rechercher un outil, une machine, un fournisseur..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 border-2 border-cream-300 rounded-lg focus:border-sawaka-500 focus:ring-0"
        />
      </div>

      {/* 🔧 Liste d’outils */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((tool, i) => (
          <div
            key={i}
            className="relative bg-white p-5 border border-cream-300 rounded-xl shadow-sm hover:shadow-lg transition group cursor-pointer"
          >
            <div className="text-lg font-semibold text-sawaka-700">
              {tool.name}
            </div>

            {/* 🟦 Info-bulle au survol */}
            <div className="absolute left-0 top-full mt-2 w-full p-3 rounded-lg shadow-md border bg-white opacity-0 group-hover:opacity-100 transition pointer-events-none">
              {tool.vendor ? (
                <>
                  <div className="text-sm text-sawaka-700">
                    📍 Vendeur : <span className="font-medium">{tool.vendor}</span>
                  </div>
                  <div className="text-sm text-sawaka-700 mt-1">
                    💰 Prix : <span className="font-medium">{tool.price}</span>
                  </div>
                </>
              ) : (
                <div className="text-sm text-red-600 font-semibold">
                  ❗ Aucun fabricant pour cet outil !  
                  <br />Voilà une opportunité !
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-6 text-sawaka-600">Aucun outil trouvé.</p>
      )}
    </div>
  );
}
