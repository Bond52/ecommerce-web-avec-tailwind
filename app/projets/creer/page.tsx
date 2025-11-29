"use client";

import { useState } from "react";

// ⭐ MOCK artisans par ville (identiques aux options d'inscription)
const artisansParVille: Record<string, string[]> = {
  "douala": ["Atelier Mama Bois", "TigeForgée Cameroun", "Bois & Bambou"],
  "yaounde": ["Menuiserie Essingan", "TechnoForge", "Arts Meka"],
  "bafoussam": ["Bambou de l'Ouest", "Forge du Plateau"],
  "kribi": ["CréaBois Kribi"],
  "garoua": [],
  "maroua": [],
  "bertoua": [],
  "ebolowa": [],
  "limbe": ["Limbe Wood Factory"]
};

// ⭐ LISTE DES VILLES identiques à la page d'inscription
const villes = [
  "Douala",
  "Yaoundé",
  "Bafoussam",
  "Kribi",
  "Garoua",
  "Maroua",
  "Bertoua",
  "Ebolowa",
  "Limbe"
];

export default function CreerProjetPage() {
  const [amount, setAmount] = useState("");
  const [city, setCity] = useState("");
  const [result, setResult] = useState<any>(null);

  // Nettoyage du montant libre
  function parseAmount(raw: string) {
    return Number(raw.replace(/[^\d]/g, ""));
  }

  function generateProject() {
    const value = parseAmount(amount);
    const cityKey = city.trim().toLowerCase();

    if (!value || value <= 0) {
      setResult({ error: "Veuillez entrer un montant valide." });
      return;
    }
    if (!cityKey) {
      setResult({ error: "Veuillez sélectionner une ville." });
      return;
    }

    const artisans = artisansParVille[cityKey] || [];

    // ⭐ Catalogue des projets (hiérarchie)
    const catalogue = [
      {
        max: 10000,
        title: "Petit tabouret en bois",
        details: "Projet simple et économique.",
        materials: ["Planche", "Clous", "Vernis"],
      },
      {
        max: 30000,
        title: "Table basse artisanale",
        details: "Une belle table en bois massif.",
        materials: ["Bois", "Visserie", "Ponçage", "Finition"],
      },
      {
        max: 60000,
        title: "Babyfoot artisanal 🎉",
        details: "Un babyfoot complet fabriqué localement.",
        materials: ["Bois solide", "Tiges en acier", "Roulements", "Peinture"],
      },
    ];

    // On récupère tous les projets possibles selon le budget
    const possibles = catalogue.filter((p) => p.max <= value);

    if (possibles.length === 0) {
      setResult({ error: "Aucun projet disponible pour ce budget." });
      return;
    }

    setResult({
      budget: value,
      city: cityKey,
      artisans,
      allProjects: possibles
    });
  }

  return (
    <div className="wrap py-12">

      {/* Titre */}
      <h1 className="text-3xl md:text-4xl font-bold text-sawaka-700 mb-4">
        Créer un projet
      </h1>

      <p className="text-sawaka-700 text-lg max-w-2xl mb-10">
        Découvrez ce que vous pouvez construire selon votre budget, vos
        ressources locales et les artisans de votre ville.
      </p>

      {/* FORMULAIRE */}
      <div className="max-w-2xl mb-12 border border-cream-300 p-6 rounded-xl bg-white shadow-sm">

        <div className="font-semibold text-sawaka-700 mb-4">
          Que puis-je faire avec…
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center">

          {/* -- Champ Montant -- */}
          <div className="flex items-center gap-2 w-full md:w-1/2">
            <input
              type="text"
              value={amount}
              placeholder="Ex : 30 000"
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 p-3 border-2 border-cream-300 rounded-lg focus:border-sawaka-500"
            />
            <span className="px-3 py-2 bg-cream-200 rounded-lg text-sawaka-700 font-semibold">
              FCFA
            </span>
          </div>

          {/* Texte intermédiaire */}
          <div className="font-semibold text-sawaka-700 whitespace-nowrap">
            dans la ville de
          </div>

          {/* -- Liste déroulante Ville -- */}
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="p-3 border-2 border-cream-300 rounded-lg focus:border-sawaka-500 w-full md:w-1/3"
          >
            <option value="">Sélectionnez une ville</option>
            {villes.map((v) => (
              <option key={v} value={v.toLowerCase()}>
                {v}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={generateProject}
          className="mt-6 bg-sawaka-600 text-white px-6 py-3 rounded-lg hover:bg-sawaka-700"
        >
          Voir les projets possibles
        </button>
      </div>

      {/* AFFICHAGE RESULTAT */}
      {result && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-cream-300 max-w-2xl">

          {/* Erreur */}
          {result.error ? (
            <p className="text-red-600 font-semibold">{result.error}</p>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-sawaka-700 mb-3">
                Avec {result.budget.toLocaleString("fr-FR")} FCFA à{" "}
                {result.city.charAt(0).toUpperCase() + result.city.slice(1)}
              </h2>

              <h3 className="text-xl font-bold text-sawaka-800 mb-4">
                Projets réalisables
              </h3>

              {/* -- LISTE DES PROJETS -- */}
              <div className="space-y-6 mb-6">
                {result.allProjects.map((proj: any, i: number) => (
                  <div
                    key={i}
                    className="p-4 bg-cream-50 border border-cream-300 rounded-lg"
                  >
                    <div className="font-bold text-sawaka-700">{proj.title}</div>

                    <div className="text-sm text-sawaka-600 mb-2">
                      {proj.details}
                    </div>

                    <div className="font-semibold text-sawaka-700">Matériaux :</div>
                    <ul className="list-disc pl-6 text-sawaka-700">
                      {proj.materials.map((m: string, j: number) => (
                        <li key={j}>{m}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* -- ARTISANS DISPONIBLES -- */}
              <h3 className="text-xl font-bold text-sawaka-800 mb-2">
                Artisans disponibles dans la ville :
              </h3>

              {result.artisans.length > 0 ? (
                <ul className="list-disc pl-6 text-sawaka-700">
                  {result.artisans.map((a: string, i: number) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-red-600 font-semibold">
                  Aucun artisan disponible pour ce projet dans cette ville.
                </p>
              )}

              <p className="mt-6 text-sm text-sawaka-500">
                (Mock — La version finale utilisera les vrais artisans et les vrais fournisseurs du réseau Sawaka.)
              </p>
            </>
          )}
        </div>
      )}

    </div>
  );
}
