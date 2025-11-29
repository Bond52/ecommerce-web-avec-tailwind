"use client";

import { useState } from "react";
import { listArtisansByCity } from "@/app/lib/apiArtisans";
import { listFournisseurs } from "@/app/lib/apiFournisseurs";
import { listTools } from "@/app/lib/apiTools";

const CITIES = [
  "Douala", "Yaoundé", "Bafoussam", "Ebolowa", "Kribi",
  "Garoua", "Maroua", "Buea", "Bamenda", "Bertoua",
  "Ngaoundéré", "Limbe", "Dschang"
];

// Idées de projets selon budget (mock inspirant)
function getProjectIdeas(budget: number) {
  if (budget <= 5000) {
    return [
      "Petite décoration en bois",
      "Boîte personnalisée",
      "Porte-clef artisanal"
    ];
  } else if (budget <= 15000) {
    return [
      "Tabouret simple",
      "Cadre photo solide",
      "Mini-étagère murale"
    ];
  } else if (budget <= 30000) {
    return [
      "Table basse minimaliste",
      "Tabouret renforcé",
      "Lampe artisanale",
      "Début de pièces pour babyfoot artisanal"
    ];
  } else {
    return [
      "Meuble complet",
      "Babyfoot artisanal (structure de base)",
      "Chaise haut de gamme",
    ];
  }
}

export default function CreerProjetPage() {
  const [budget, setBudget] = useState<number | null>(null);
  const [city, setCity] = useState("");
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!budget || !city) return;

    setLoading(true);

    try {
      const artisans = await listArtisansByCity(city);
      const fournisseurs = await listFournisseurs();
      const tools = await listTools();

      // Filtrer matériaux abordables (mock simple basé sur prix textuels)
      const affordableMaterials = fournisseurs.filter((f) => {
        const price = parseInt(f.produits?.join(", ") || "0");
        return price <= budget;
      });

      // Idées de projets selon budget
      const ideas = getProjectIdeas(budget);

      setResult({
        artisans,
        fournisseurs: affordableMaterials,
        tools,
        ideas,
      });
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  return (
    <div className="wrap py-12">
      {/* TITLE */}
      <h1 className="text-3xl font-bold text-sawaka-700 mb-4">
        Créer un projet
      </h1>

      <p className="text-sawaka-700 text-lg leading-relaxed max-w-2xl mb-8">
        Indiquez votre budget et votre ville, et Sawaka vous proposera
        des matériaux, des artisans et des idées de projets adaptés.
        <br />
        🧠 Objectif : stimuler la créativité, pas imposer un projet.
      </p>

      {/* FORMULAIRE */}
      <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-6 mb-12">
        {/* Budget */}
        <div>
          <label className="block mb-2 font-semibold">Votre budget (FCFA)</label>
          <input
            type="number"
            min="100"
            className="w-full p-3 border-2 border-cream-300 rounded-lg focus:border-sawaka-500"
            onChange={(e) => setBudget(parseInt(e.target.value))}
          />
        </div>

        {/* Ville */}
        <div>
          <label className="block mb-2 font-semibold">Votre ville</label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full p-3 border-2 border-cream-300 rounded-lg focus:border-sawaka-500"
          >
            <option value="">Sélectionner une ville</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full bg-sawaka-600 hover:bg-sawaka-700 text-white p-3 rounded-lg transition"
          >
            Explorer les possibilités
          </button>
        </div>
      </form>

      {loading && (
        <p className="text-center text-sawaka-600 text-lg">Analyse du projet…</p>
      )}

      {/* RESULT */}
      {result && (
        <div className="space-y-12">
          {/* --- ARTISANS --- */}
          <div>
            <h2 className="text-2xl font-bold text-sawaka-700 mb-3">
              👨‍🏭 Artisans disponibles à {city}
            </h2>
            {result.artisans.length === 0 ? (
              <p className="text-sawaka-600">Aucun artisan disponible dans cette ville.</p>
            ) : (
              <ul className="space-y-2">
                {result.artisans.map((a: any) => (
                  <li key={a._id} className="p-3 bg-white border rounded-lg shadow-sm">
                    {a.firstName} {a.lastName} — {a.city}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* --- MATÉRIAUX --- */}
          <div>
            <h2 className="text-2xl font-bold text-sawaka-700 mb-3">
              🪵 Matériaux accessibles avec {budget} FCFA
            </h2>
            {result.fournisseurs.length === 0 ? (
              <p className="text-sawaka-600">Aucun matériau trouvable dans ce budget.</p>
            ) : (
              <ul className="grid md:grid-cols-2 gap-4">
                {result.fournisseurs.map((f: any) => (
                  <li key={f.id} className="p-4 border rounded-lg bg-white shadow-sm">
                    <div className="font-semibold text-sawaka-800">{f.nom}</div>
                    <div className="text-sm text-sawaka-600">
                      📍 {f.categorie}
                      <br />
                      💰 {f.prix || "Prix non spécifié"}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* --- OUTILS --- */}
          <div>
            <h2 className="text-2xl font-bold text-sawaka-700 mb-3">
              🔧 Outils accessibles dans votre réseau Sawaka
            </h2>

            <ul className="grid md:grid-cols-2 gap-4">
              {result.tools.map((t: any) => (
                <li key={t.id} className="p-4 border rounded-lg bg-white shadow-sm">
                  <div className="font-semibold text-sawaka-800">{t.name}</div>
                  <div className="text-sm text-sawaka-600">
                    {t.vendor ? (
                      <>
                        📍 {t.vendor}
                        <br />
                        💰 {t.price}
                      </>
                    ) : (
                      <span className="text-red-600">Aucun fabricant — opportunité artisanale</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* --- IDÉES DE PROJETS --- */}
          <div>
            <h2 className="text-2xl font-bold text-sawaka-700 mb-3">
              💡 Idées inspirantes basées sur votre budget
            </h2>

            <ul className="list-disc pl-6 text-sawaka-700 space-y-1">
              {result.ideas.map((idea: string, i: number) => (
                <li key={i}>{idea}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
