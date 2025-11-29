"use client";

import { useState } from "react";

export default function CreerProjetPage() {
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState<any>(null);

  // Nettoyage automatique du texte → montant numérique
  function parseAmount(raw: string) {
    const digits = raw.replace(/[^\d]/g, ""); // garde uniquement les chiffres
    return Number(digits);
  }

  // MOCK : renvoie un projet selon un budget
  function generateProject() {
    const value = parseAmount(amount);

    if (!value || value <= 0) {
      setResult({ error: "Veuillez entrer un montant valide." });
      return;
    }

    // MOCK simple selon le budget
    if (value < 10000) {
      setResult({
        title: "Petit tabouret en bois",
        cost: value,
        details:
          "Avec un budget inférieur à 10 000 FCFA, vous pouvez fabriquer un tabouret simple grâce aux artisans et outils du réseau Sawaka.",
        materials: [
          "Planche en bois",
          "Clous",
          "Vernis (optionnel)",
          "Découpe + assemblage par un artisan"
        ]
      });
    } else if (value < 30000) {
      setResult({
        title: "Table basse artisanale",
        cost: value,
        details:
          "Avec ce budget, vous pouvez construire une belle table basse en bois massif ou recyclé.",
        materials: [
          "Bois massif / récupéré",
          "Vis et quincaillerie",
          "Ponçage et finition",
          "Possibilité de motif artistique"
        ]
      });
    } else {
      setResult({
        title: "Babyfoot artisanal 🎉",
        cost: value,
        details:
          "Avec ce budget, vous pouvez commencer un vrai babyfoot artisanal avec les matériaux, outils et artisans du réseau Sawaka.",
        materials: [
          "Bois solide",
          "Tiges en acier",
          "Roulements",
          "Peinture",
          "Outils fournis via l’Arbre à outils"
        ]
      });
    }
  }

  return (
    <div className="wrap py-12">

      {/* Titre */}
      <h1 className="text-3xl md:text-4xl font-bold text-sawaka-700 mb-4">
        Créer un projet
      </h1>

      <p className="text-sawaka-700 text-lg leading-relaxed max-w-2xl mb-10">
        Entrez votre budget et découvrez ce que vous pouvez construire grâce aux artisans,
        fournisseurs et outils du réseau Sawaka.
      </p>

      {/* Formulaire */}
      <div className="max-w-md mb-12">
        <label className="block mb-2 font-semibold text-sawaka-700">
          Qu’est-ce que je peux faire avec…
        </label>

        <div className="flex gap-2">
          <input
            type="text"
            value={amount}
            placeholder="Ex : 30 000 ou 30000 ou 30.000"
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 p-3 border-2 border-cream-300 rounded-lg focus:border-sawaka-500"
          />

          <span className="flex items-center px-3 py-2 bg-cream-200 rounded-lg text-sawaka-700 font-semibold">
            FCFA
          </span>
        </div>

        <button
          onClick={generateProject}
          className="mt-4 bg-sawaka-600 text-white px-6 py-3 rounded-lg hover:bg-sawaka-700"
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
                Projet possible : {result.title}
              </h2>

              <p className="text-sawaka-700 mb-4">{result.details}</p>

              <h3 className="font-bold text-sawaka-800 mb-2">
                Matériaux / étapes estimés :
              </h3>

              <ul className="list-disc pl-6 space-y-1 text-sawaka-700">
                {result.materials.map((m: string, i: number) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>

              <p className="mt-6 text-sm text-sawaka-500">
                (Mock de démonstration — la version finale utilisera les données réelles du réseau Sawaka.)
              </p>
            </>
          )}
        </div>
      )}

    </div>
  );
}
