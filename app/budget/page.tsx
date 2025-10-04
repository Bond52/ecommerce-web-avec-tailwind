'use client';

import { useState } from "react";

export default function BudgetPage() {
  const [activeTab, setActiveTab] = useState<"budget" | "projet">("budget");
  const [montant, setMontant] = useState("");
  const [result, setResult] = useState<any>(null);

  const API = process.env.NEXT_PUBLIC_API_BASE ?? "https://ecommerce-web-avec-tailwind.onrender.com";

  const handleBudget = async () => {
    try {
      const res = await fetch(`${API}/api/budget/assistant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ montant: Number(montant) }),
      });
      setResult(await res.json());
    } catch (err) {
      setResult({ error: "Erreur lors de l’appel à l’assistant budget." });
    }
  };

  const handleProjetIA = async () => {
    try {
      const res = await fetch(`${API}/api/budget/assistant-ia`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      setResult(await res.json());
    } catch (err) {
      setResult({ error: "Erreur lors de l’appel à l’assistant IA." });
    }
  };

  return (
    <main className="wrap py-8">
      <h1 className="text-2xl font-bold text-sawaka-700 mb-6">💡 Assistant Sawaka</h1>

      {/* Onglets */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab("budget")}
          className={`px-4 py-2 ${
            activeTab === "budget"
              ? "border-b-2 border-sawaka-500 text-sawaka-600"
              : "text-sawaka-400"
          }`}
        >
          Assistant Budget
        </button>
        <button
          onClick={() => setActiveTab("projet")}
          className={`px-4 py-2 ${
            activeTab === "projet"
              ? "border-b-2 border-sawaka-500 text-sawaka-600"
              : "text-sawaka-400"
          }`}
        >
          Assistant Projet (IA)
        </button>
      </div>

      {/* Formulaire */}
      <div className="space-y-4">
        {activeTab === "budget" && (
          <input
            type="number"
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
            placeholder="Montant disponible (FCFA)"
            className="w-full border px-4 py-2 rounded-lg"
          />
        )}

        <button
          onClick={activeTab === "budget" ? handleBudget : handleProjetIA}
          className="px-6 py-3 bg-sawaka-500 text-white rounded-lg"
        >
          {activeTab === "budget"
            ? "Lancer l’assistant Budget"
            : "Lancer l’assistant Projet (IA)"}
        </button>
      </div>

      {/* Résultats */}
      {result && (
        <div className="mt-6 bg-white p-4 rounded-lg shadow space-y-3">
          {result.error && (
            <p className="text-red-600">{result.error}</p>
          )}
          {result.projetIA && (
            <div>
              <h2 className="font-semibold text-lg text-sawaka-700 mb-2">
                Proposition IA :
              </h2>
              <p className="text-sawaka-600 whitespace-pre-wrap">
                {result.projetIA}
              </p>
            </div>
          )}
          {result.produits && result.produits.length > 0 && (
            <div>
              <h3 className="font-semibold text-sawaka-700 mb-2">Articles concernés :</h3>
              <ul className="list-disc ml-6 space-y-1">
                {result.produits.map((p: any, i: number) => (
                  <li key={i}>{p.title} ({p.price} FCFA)</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
