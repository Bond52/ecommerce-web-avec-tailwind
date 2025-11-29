"use client";

import { useState } from "react";

// ⭐ MOCK artisans par ville (exemple simple)
const artisansParVille: Record<string, string[]> = {
  "douala": ["Atelier Mama Bois", "TigeForgée Cameroun", "Bois & Bambou"],
  "yaounde": ["Menuiserie Essingan", "TechnoForge", "Arts Meka"],
  "bafoussam": ["Bambou de l'Ouest", "Forge du Plateau"],
  "kribi": ["CréaBois Kribi"],
};

export default function CreerProjetPage() {
  const [amount, setAmount] = useState("");
  const [city, setCity] = useState("");
  const [result, setResult] = useState<any>(null);

  // Nettoyage automatique du montant
  function parseAmount(raw: string) {
    const digits = raw.replace(/[^\d]/g, ""); // garder uniquement les chiffres
    return Number(digits);
  }

  // MOCK : création de projet
  function generateProject() {
    const value = parseAmount(amount);
    const cityKey = city.trim().toLowerCase();

    if (!value || value <= 0) {
      setResult({ error: "Veuillez entrer un montant valide." });
      return;
    }

    if (!cityKey) {
      setResult({ error: "Veuillez entrer une ville." });
      return;
    }

    // Récupération artisans pour cette ville
    const artisans = artisansParVille[cityKey] || [];

    // Sélection du projet selon le budget
    let project: any;

    if (value < 10000) {
      project = {
        title: "Petit tabouret en bois",
        details:
          "Projet simple et abordable, parfait pour apprendre la menuiserie.",
        materials: ["Planche en bois", "Clous", "Vernis (optionnel)"],
      };
    } else if (value < 30000) {
      project = {
        title: "Table basse artisanale",
        details:
          "Une belle table en bois massif ou recyclé, réalisée avec des artisans locaux.",
        materials: ["Bois massif", "Vis", "Ponçage", "Finition"],
      };
    } else {
      project = {
        title: "Babyfoot artisanal 🎉",
        details:
          "Un babyfoot complet, grâce aux artisans du réseau Sawaka.",
        materials: [
          "Bois solide",
          "Tiges en acier",
          "Roulements",
          "Peinture",
          "Assemblage"
        ],
      };
    }

    // Création du résultat final
    setResult({
      title: project.title,
      budget: value,
      city: cityKey,
      details: project.details,
      materials: project.materials,
      artisans,
    });
  }

  return (
    <div className="wrap py-12">

      {/* Titre */}
      <h1 className="text-3xl md:text-4xl font-bold text-sawaka-700 mb-4">
        Créer un projet
      </h1>

      <p className="text-sawaka-700 text-lg leading-relaxed max-w-2xl mb-10">
        Entrez votre budget et votre ville pour découvrir ce que vous pouvez construire
        grâce aux artisans et outils du réseau Sawaka.
      </p>

      {/* Formulaire */}
      <div className="max-w-md mb-12">

        {/* MONTANT */}
        <label className="block mb-2 font-semibold text-sawaka-700">
          Montant disponible
        </label>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={amount}
            placeholder="Ex : 30 000"
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 p-3 border-2 border-cream-300 rounded-lg focus:border-sawaka-500"
          />

          <span className="flex items-center px-3 py-2 bg-cream-200 rounded-lg text-sawaka-700 font-semibold">
            FCFA
          </span>
        </div>

        {/* VILLE */}
        <label className="block mb-2 font-semibold text-sawaka-700">
          Ville
        </label>

        <input
          type="text"
          value={city}
          placeholder="Ex : Douala"
          onChange={(e) => setCity(e.target.value)}
          className="w-full p-3 border-2 border-cream-300 rounded-lg focus:border-sawaka-500"
        />

        <button
          onClick={generateProject}
          className="mt-6 bg-sawaka-600 text-white px-6 py-3 rounded-lg hover:bg-sawaka-700"
        >
          Voir le projet
        </button>
      </div>

      {/* Résultat */}
      {result && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-cream-300 max-w-2xl">

          {result.error ? (
            <p className="text-red-600 font-semibold">{result.error}</p>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-sawaka-700 mb-3">
                Avec {result.budget.toLocaleString("fr-FR")} FCFA à {result.city.charAt(0).toUpperCase() + result.city.slice(1)}
              </h2>

              <h3 className="text-xl font-semibold text-sawaka-800 mb-3">
                Projet possible : {result.title}
              </h3>

              <p className="text-sawaka-700 mb-4">{result.details}</p>

              {/* Matériaux */}
              <h4 className="font-bold text-sawaka-800 mb-2">Matériaux estimés :</h4>
              <ul className="list-disc pl-6 space-y-1 text-sawaka-700 mb-6">
                {result.materials.map((m: string, i: number) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>

              {/* Artisans */}
              <h4 className="font-bold text-sawaka-800 mb-2">
                Artisans disponibles à {result.city.charAt(0).toUpperCase() + result.city.slice(1)} :
              </h4>

              {result.artisans.length > 0 ? (
                <ul className="list-disc pl-6 space-y-1 text-sawaka-700">
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
                (Mock de démonstration — version future connectée aux artisans réels du réseau Sawaka.)
              </p>
            </>
          )}
        </div>
      )}

    </div>
  );
}
