"use client";

import { useEffect, useState } from "react";
import { listTools, Tool } from "@/app/lib/apiTools";

/* 🔁 Expansion récursive depuis la BD (sans l’outil racine) */
function expandTool(rootId: string, all: Tool[]) {
  const visited = new Set<string>();
  const result: Tool[] = [];

  function explore(id: string) {
    if (visited.has(id)) return;
    visited.add(id);

    const node = all.find((t) => t.id === id);
    if (!node) return;

    result.push(node);
    node.children?.forEach((child) => explore(child));
  }

  explore(rootId);

  // ❌ Supprimer la première entrée = l’outil sélectionné lui-même
  return result.slice(1);
}

export default function ArbrePage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [selected, setSelected] = useState<Tool[]>([]);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  /* 📥 Charger les outils depuis MongoDB */
  useEffect(() => {
    async function load() {
      try {
        const data = await listTools();
        // ❌ Babyfoot doit être un projet → pas un outil
        setTools(data.filter((t) => t.id !== "babyfoot"));
      } catch (e) {
        console.error("Erreur chargement tools:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <p className="text-center py-12 text-sawaka-600 text-lg">
        Chargement des outils…
      </p>
    );
  }

  /* 🔎 Filtre */
  const filtered = tools.filter((t) =>
    t.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="wrap py-12">
      <h1 className="text-3xl font-bold text-sawaka-700 mb-4">
        {selectedTool
          ? `L’Arbre à Outils de ${selectedTool.name}`
          : "L’Arbre à Outils"}
      </h1>

      <p className="text-sawaka-700 text-lg leading-relaxed max-w-2xl mb-8">
        Découvrez les outils nécessaires pour fabriquer d’autres outils.
        <br />
        En sélectionnant un outil, vous verrez automatiquement toute sa chaîne
        de dépendances (sauf l’outil lui-même).
      </p>

      {/* 🔍 Recherche */}
      <div className="max-w-lg mb-8">
        <input
          type="text"
          placeholder="Rechercher un outil…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 border-2 border-cream-300 rounded-lg focus:border-sawaka-500"
        />
      </div>

      {/* 🔧 LISTE DES OUTILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filtered.map((tool) => (
          <div
            key={tool.id}
            onClick={() => {
              setSelectedTool(tool);
              setSelected(expandTool(tool.id, tools));
            }}
            className="cursor-pointer bg-white p-5 border border-cream-300 rounded-xl shadow-sm hover:shadow-lg transition"
          >
            <div className="text-lg font-semibold text-sawaka-700">
              {tool.name}
            </div>

            <div className="text-sm text-sawaka-600 mt-2">
              {tool.vendor ? (
                <>
                  📍 {tool.vendor}
                  <br />
                  💰 {tool.price}
                </>
              ) : tool.id !== "main" ? (
                <span className="text-red-600 font-semibold">
                  ❗ Aucun fabricant — Opportunité locale !
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {/* 🌳 CHAÎNE D’OUTILS */}
      {selectedTool && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-cream-300">
          <h2 className="text-2xl font-bold text-sawaka-700 mb-4">
            Outils nécessaires pour fabriquer : {selectedTool.name}
          </h2>

          {selected.length === 0 ? (
            <p className="text-sawaka-600">
              Aucun outil n’est nécessaire — ou cet outil est un outil final.
            </p>
          ) : (
            <ul className="space-y-4">
              {selected.map((tool) => (
                <li
                  key={tool.id}
                  className="p-4 border rounded-lg bg-cream-50 border-cream-300"
                >
                  <div className="font-semibold text-sawaka-800">
                    {tool.name}
                  </div>

                  {tool.id === "main" ? (
                    <div className="text-sm text-sawaka-600 mt-1">
                      🖐️ L’outil final est… la main de l’artisan !
                    </div>
                  ) : (
                    <div className="text-sm text-sawaka-600 mt-1">
                      📍 Vendeur : {tool.vendor || "Non disponible"} <br />
                      💰 Prix : {tool.price || "Non disponible"}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {filtered.length === 0 && (
        <p className="mt-6 text-sawaka-600">Aucun outil trouvé.</p>
      )}
    </div>
  );
}
