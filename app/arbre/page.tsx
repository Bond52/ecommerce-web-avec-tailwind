"use client";

import { useState } from "react";

/* 🌳 ARBRE D’OUTILS (parent → enfants) */
const toolTree = [
  {
    id: "babyfoot",
    name: "Babyfoot (projet complet)",
    vendor: null,
    price: null,
    children: ["planche-bois", "visserie", "peinture"],
  },

  {
    id: "planche-bois",
    name: "Découper une planche de bois",
    vendor: "Menuiserie BoisPlus",
    price: "5 000 FCFA",
    children: ["scie", "metre", "main"],
  },

  {
    id: "visserie",
    name: "Visserie / Assemblage",
    vendor: "Quincaillerie Express",
    price: "2 000 FCFA",
    children: ["tournevis", "main"],
  },

  {
    id: "peinture",
    name: "Peinture / Finition",
    vendor: "MasterPaint Douala",
    price: "3 000 FCFA",
    children: ["pinceau", "main"],
  },

  // 🔧 OUTILS SIMPLES
  { id: "scie", name: "Scie manuelle", vendor: "Bois & Bambou", price: "4 500 FCFA", children: ["main"] },
  { id: "metre", name: "Mètre ruban", vendor: "DécoBois", price: "1 000 FCFA", children: ["main"] },
  { id: "tournevis", name: "Tournevis", vendor: "Quincaillerie Express", price: "800 FCFA", children: ["main"] },
  { id: "pinceau", name: "Pinceau", vendor: "MasterPaint", price: "500 FCFA", children: ["main"] },

  // 🖐️ FIN DE CHAÎNE
  { id: "main", name: "La main de l’artisan 🖐️", vendor: null, price: null, children: [] },
];

/* 🔍 Trouver un outil par ID */
function getTool(id: string) {
  return toolTree.find((t) => t.id === id) || null;
}

/* 🔁 Expansion récursive : trouve toutes les dépendances d’un outil */
function expandTool(id: string) {
  const root = getTool(id);
  if (!root) return [];

  const result: any[] = [];
  const visited = new Set<string>();

  function explore(nodeId: string) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    const node = getTool(nodeId);
    if (!node) return;

    result.push(node);

    // explore enfants
    node.children.forEach((childId) => explore(childId));
  }

  explore(id);
  return result;
}

export default function ArbrePage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<any[]>([]);

  // outils filtrés
  const filtered = toolTree.filter((t) =>
    t.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="wrap py-12">
      <h1 className="text-3xl font-bold text-sawaka-700 mb-4">L’Arbre à Outils</h1>

      <p className="text-sawaka-700 text-lg leading-relaxed max-w-2xl mb-8">
        Découvrez les outils nécessaires pour créer d’autres outils.
        <br />
        En recherchant un outil, vous verrez automatiquement tous les éléments nécessaires pour le fabriquer.
        <br /><br />
        Lorsqu’il n’existe aucun fabricant national pour un outil, c’est une opportunité pour l’industrialisation locale.
      </p>

      {/* 🔍 Barre de recherche */}
      <div className="max-w-lg mb-8">
        <input
          type="text"
          placeholder="Rechercher un outil…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 border-2 border-cream-300 rounded-lg focus:border-sawaka-500 focus:ring-0"
        />
      </div>

      {/* 🔧 LISTE DES OUTILS DISPONIBLES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filtered.map((tool) => (
          <div
            key={tool.id}
            onClick={() => setSelected(expandTool(tool.id))}
            className="cursor-pointer bg-white p-5 border border-cream-300 rounded-xl shadow-sm hover:shadow-lg transition relative"
          >
            <div className="text-lg font-semibold text-sawaka-700">{tool.name}</div>

            <div className="text-sm text-sawaka-600 mt-2">
              {tool.vendor ? (
                <>
                  📍 {tool.vendor}
                  <br />
                  💰 {tool.price}
                </>
              ) : (
                <span className="text-red-600 font-semibold">
                  ❗ Aucun fabricant — Opportunité locale !
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 🌳 AFFICHAGE DE L’ARBRE EXPANSÉ */}
      {selected.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-cream-300">
          <h2 className="text-2xl font-bold text-sawaka-700 mb-4">
            Chaîne complète des outils nécessaires
          </h2>

          <ul className="space-y-4">
            {selected.map((tool) => (
              <li
                key={tool.id}
                className="p-4 border rounded-lg bg-cream-50 border-cream-300"
              >
                <div className="font-semibold text-sawaka-800">{tool.name}</div>

                {tool.id !== "main" && (
                  <div className="text-sm text-sawaka-600 mt-1">
                    📍 Vendeur : {tool.vendor || "Non disponible"}
                    <br />
                    💰 Prix : {tool.price || "Non disponible"}
                  </div>
                )}

                {tool.id === "main" && (
                  <div className="text-sm text-sawaka-600 mt-1">
                    🖐️ L’outil final est… la main de l’artisan !
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {filtered.length === 0 && (
        <p className="mt-6 text-sawaka-600">Aucun outil trouvé.</p>
      )}
    </div>
  );
}
