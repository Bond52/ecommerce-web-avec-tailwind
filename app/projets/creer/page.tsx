"use client";

import { useState } from "react";

export default function CreerProjetPage() {
  const [amount, setAmount] = useState("");
  const [project, setProject] = useState<any>(null);

  function generateProject() {
    const value = Number(amount);

    if (!value || value <= 0) {
      setProject({ error: "Veuillez entrer un montant valide." });
      return;
    }

    // 📌 MOCK : logique de sélection simple
    let suggestion;

    if (value < 15000) {
      suggestion = {
        title: "Tabouret artisanal",
        description:
          "Un petit tabouret en bois solide, accessible et parfait pour débuter.",
        estimated: "10 000–15 000 FCFA",
        materials: ["Bois local", "Clous", "Finition simple"],
      };
    } else if (value < 40000) {
      suggestion = {
        title: "Table artisanale",
        description:
          "Une table simple mais robuste, idéale pour l’atelier ou la maison.",
        estimated: "25 000–40 000 FCFA",
        materials: ["Planche de bois", "Scie manuelle", "Visserie", "Ponceuse"],
      };
    } else {
      suggestion = {
        title: "Babyfoot artisanal",
        description:
          "Un babyfoot complet fabriqué avec les outils du réseau Sawaka.",
        estimated: "45 000–70 000 FCFA",
        materials: ["Bois", "Tiges métal", "Peinture", "Visserie"],
      };
    }

    setProject(suggestion);
  }

  return (
    <div className="wrap py-12">
      <h1 className="text-3xl font-bold text-sawaka-700 mb-4">
        Créer un projet
      </h1>

      <p className="text-sawaka-700 max-w-2xl mb-8">
        Entrez votre budget et découvrez ce que vous pouvez construire grâce aux
        artisans, fournisseurs et outils du réseau Sawaka.
      </p>

      {/* ─────────── Zone de saisie ─────────── */}
      <div className="max-w-md mb-8">
        <label className="block mb-2 font-semibold text-sawaka-700">
          Qu’est-ce que je peux faire avec…
        </label>

        <div className="flex gap-2">
          <input
            type="number"
            value={amount}
            placeholder="Ex : 30000"
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

      {/* ─────────── Résultat ─────────── */}
      {project && (
        <div className="bg-white border rounded-xl p-6 shadow-md max-w-xl">
          {project.error ? (
            <div className="text-red-600 font-semibold">{project.error}</div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-sawaka-800 mb-3">
                {project.title}
              </h2>

              <p className="text-sawaka-700 mb-4">{project.description}</p>

              <div className="mb-4 text-sawaka-800 font-medium">
                Estimation : {project.estimated}
              </div>

              <div className="mb-4">
                <strong className="text-sawaka-700">Matériaux requis :</strong>
                <ul className="list-disc ml-6 mt-2 text-sawaka-600">
                  {project.materials.map((m: string, i: number) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>

              <button className="bg-sawaka-500 text-white px-5 py-2 rounded-lg hover:bg-sawaka-600">
                Commencer ce projet
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
