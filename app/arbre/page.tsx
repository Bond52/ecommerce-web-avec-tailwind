"use client";

import { useState } from "react";

export default function ArbrePage() {
  const [query, setQuery] = useState("");

  return (
    <div className="wrap py-12">
      <h1 className="text-3xl font-bold text-sawaka-700 mb-4">
        L’Arbre à Outils
      </h1>

      <p className="text-sawaka-700 text-lg leading-relaxed max-w-2xl mb-8">
        Cette section vous donnera accès à tous les outils nécessaires, ainsi qu’aux vendeurs
        locaux qui les proposent pour soutenir vos projets — qu’ils soient artisanaux ou industriels.
        Comme le dit l’adage revisité : <span className="font-semibold text-sawaka-800">
          « Lorsqu’un pays manque d’outils, il dépend inévitablement de l’extérieur. »
        </span>
      </p>

      {/* 🔍 Zone de recherche */}
      <div className="max-w-lg">
        <input
          type="text"
          placeholder="Rechercher un outil, une machine, un fournisseur..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 border-2 border-cream-300 rounded-lg focus:border-sawaka-500 focus:ring-0"
        />
      </div>

      <div className="mt-6 p-4 bg-cream-100 border border-cream-300 rounded-lg text-sawaka-600">
        (Le catalogue d’outils et de fournisseurs locaux sera bientôt disponible)
      </div>
    </div>
  );
}
