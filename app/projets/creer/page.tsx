"use client";

import { useState } from "react";
import { listFournisseurs } from "@/app/lib/apiFournisseurs";
import { listTools } from "@/app/lib/apiTools";

/* ------------------------------------------------------------------
   📌 Liste des villes disponibles 
------------------------------------------------------------------- */
const CITIES = [
  "Douala", "Yaoundé", "Bafoussam", "Ebolowa", "Kribi",
  "Garoua", "Maroua", "Buea", "Bamenda", "Bertoua",
  "Ngaoundéré", "Limbe", "Dschang"
];

/* ------------------------------------------------------------------
   💡 Idées de projets selon budget (mock)
------------------------------------------------------------------- */
function getProjectIdeas(budget: number) {
  if (budget <= 5000) {
    return ["Petite décoration en bois", "Boîte personnalisée", "Porte-clef artisanal"];
  } else if (budget <= 15000) {
    return ["Tabouret simple", "Cadre photo solide", "Mini-étagère murale"];
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
  const [budget, setBudget] = useState<number>(0);
  const [city, setCity] = useState("");
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  /* -------------------------------------------------------------
     🔍 Soumission
  -------------------------------------------------------------- */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!budget || !city) return;

    setLoading(true);

    try {
      const fournisseurs = await listFournisseurs();
      const tools = await listTools();
      const ideas = getProjectIdeas(budget);

      /* 🏭 Cloud Factories (ateliers communautaires Sawaka) */
      const cloudFactories = [
        {
          name: "Atelier Bois & Sculpture — Douala",
          equipments: ["Scie électrique", "Ponçeuse", "Établi massif"],
          available: true,
        },
        {
          name: "FabLab Métal — Yaoundé",
          equipments: ["Poste à souder", "Découpeuse métal", "Casques & gants"],
          available: false,
        },
        {
          name: "Atelier Textile — Bafoussam",
          equipments: ["Machines à coudre", "Table de découpe"],
          available: true,
        },
      ];

      setResult({
        fournisseurs,
        tools,
        ideas,
        cloudFactories,
      });
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  /* -------------------------------------------------------------
     🖼️ Rendu
  -------------------------------------------------------------- */
  return (
    <div className="wrap py-12">
      <h1 className="text-3xl font-bold text-sawaka-700 mb-4">Créer un projet</h1>

      <p className="text-sawaka-700 text-lg leading-relaxed max-w-2xl mb-8">
        Indiquez votre budget et votre ville, et Sawaka vous proposera des matériaux,
        des outils et des idées pour inspirer votre prochain projet.
        <br />
        🧠 <strong>Objectif :</strong> stimuler la créativité, pas imposer un projet.
      </p>

      {/* FORMULAIRE */}
      <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-6 mb-12">
        {/* Budget */}
        <div>
          <label className="block mb-2 font-semibold">Votre budget (FCFA)</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Ex : 30000"
            value={budget}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/\D/g, "");
              setBudget(cleaned === "" ? 0 : Number(cleaned));
            }}
            className="w-full h-12 px-4 rounded-lg border-2 border-cream-300 focus:border-sawaka-500"
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

        {/* Bouton Explorer */}
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full bg-sawaka-600 hover:bg-sawaka-700 text-white p-3 rounded-lg transition"
          >
            Explorer les possibilités
          </button>
        </div>
      </form>

      {loading && <p className="text-center text-sawaka-600">Analyse du projet…</p>}

      {/* RESULT */}
      {result && (
        <div className="space-y-12">

          {/* MATÉRIAUX */}
          <div>
            <h2 className="text-2xl font-bold text-sawaka-700 mb-3">
              🪵 Matériaux accessibles avec {budget} FCFA
            </h2>
            {result.fournisseurs.length === 0 ? (
              <p className="text-sawaka-600">Aucun matériau trouvable dans ce budget.</p>
            ) : (
              <ul className="grid md:grid-cols-2 gap-4">
                {result.fournisseurs.map((f: any) => (
                  <li key={f._id} className="p-4 border rounded-lg bg-white shadow-sm">
                    <div className="font-semibold text-sawaka-800">{f.nom}</div>
                    <div className="text-sm text-sawaka-600">📍 {f.categorie}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* OUTILS */}
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
                        📍 {t.vendor}<br />💰 {t.price}
                      </>
                    ) : (
                      <span className="text-red-600">
                        Aucun fabricant — opportunité artisanale
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* CLOUD FACTORIES / ATELIERS */}
          <div>
            <h2 className="text-2xl font-bold text-sawaka-700 mb-3">
              🏭 Ateliers collaboratifs (Cloud Factories)
            </h2>

            <ul className="grid md:grid-cols-2 gap-4">
              {result.cloudFactories.map((cf: any, i: number) => (
                <li key={i} className="p-4 border rounded-lg bg-white shadow-sm">
                  <div className="font-semibold text-sawaka-800">{cf.name}</div>
                  <ul className="text-sawaka-600 text-sm mt-2 list-disc pl-5">
                    {cf.equipments.map((eq: string, k: number) => (
                      <li key={k}>{eq}</li>
                    ))}
                  </ul>
                  <p className={`mt-2 font-semibold ${cf.available ? "text-green-600" : "text-red-600"}`}>
                    {cf.available ? "Disponible" : "Actuellement indisponible"}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* IDÉES */}
          <div>
            <h2 className="text-2xl font-bold text-sawaka-700 mb-3">💡 Idées inspirantes basées sur votre budget</h2>
            <ul className="list-disc pl-6 text-sawaka-700 space-y-1">
              {result.ideas.map((idea: string, i: number) => (
                <li key={i}>{idea}</li>
              ))}
            </ul>
          </div>

          {/* MESSAGE FINAL */}
          <div className="bg-sawaka-50 p-6 rounded-lg border border-sawaka-200">
            <p className="text-sawaka-700 text-lg leading-relaxed">
              🎉 <strong>Vous avez maintenant une vision claire de votre projet !</strong>
              <br />
              Vous pouvez maintenant créer et publier votre projet sur Sawaka afin d’être
              contacté par d’autres artisans et recevoir des propositions.
            </p>

            {/* BOUTON CREER UN PROJET */}
            <button
              onClick={() =>
                alert("🚫 La création de projet nécessite un compte. Fonctionnalité indisponible pour l'instant.")
              }
              className="mt-4 bg-sawaka-600 hover:bg-sawaka-700 text-white px-5 py-3 rounded-lg transition"
            >
              ➕ Créer mon projet
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
