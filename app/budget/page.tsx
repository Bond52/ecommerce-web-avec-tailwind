'use client';

import { useState } from "react";

export default function BudgetPage() {
  const [activeTab, setActiveTab] = useState<"budget"|"projet">("budget");
  const [montant, setMontant] = useState("");
  const [description, setDescription] = useState("");
  const [result, setResult] = useState<any>(null);

  const API = process.env.NEXT_PUBLIC_API_BASE ?? "https://ecommerce-web-avec-tailwind.onrender.com";

  const handleBudget = async () => {
    const res = await fetch(`${API}/api/budget/assistant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ montant: Number(montant) }),
    });
    setResult(await res.json());
  };

  const handleProjet = async () => {
    const res = await fetch(`${API}/api/budget/assistant-projet`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ montant: Number(montant), description }),
    });
    setResult(await res.json());
  };

  return (
    <main className="wrap py-8">
      <h1 className="text-2xl font-bold text-sawaka-700 mb-6">💡 Assistant Sawaka</h1>

      {/* Onglets */}
      <div className="flex gap-4 mb-6 border-b">
        <button 
          onClick={() => setActiveTab("budget")} 
          className={`px-4 py-2 ${activeTab==="budget"?"border-b-2 border-sawaka-500 text-sawaka-600":"text-sawaka-400"}`}>
          Assistant Budget
        </button>
        <button 
          onClick={() => setActiveTab("projet")} 
          className={`px-4 py-2 ${activeTab==="projet"?"border-b-2 border-sawaka-500 text-sawaka-600":"text-sawaka-400"}`}>
          Assistant Projet (IA)
        </button>
      </div>

      {/* Formulaire */}
      <div className="space-y-4">
        <input 
          type="number" 
          value={montant} 
          onChange={e => setMontant(e.target.value)} 
          placeholder="Montant disponible (FCFA)" 
          className="w-full border px-4 py-2 rounded-lg"
        />

        {activeTab==="projet" && (
          <textarea 
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Décrivez votre projet (ex: fabriquer une chaise en bois)"
            className="w-full border px-4 py-2 rounded-lg"
          />
        )}

        <button 
          onClick={activeTab==="budget"?handleBudget:handleProjet}
          className="px-6 py-3 bg-sawaka-500 text-white rounded-lg"
        >
          Lancer l’assistant
        </button>
      </div>

      {/* Résultats */}
      {result && (
        <div className="mt-6 bg-white p-4 rounded-lg shadow">
          <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </main>
  );
}
