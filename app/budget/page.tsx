"use client";

import { useState } from "react";

export default function BudgetAssistantPage() {
  const [montant, setMontant] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(
        (process.env.NEXT_PUBLIC_API_BASE ??
          "https://ecommerce-web-avec-tailwind.onrender.com") + "/api/budget/assistant",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ montant: parseInt(montant, 10) }),
        }
      );
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: "Erreur de connexion au serveur" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="wrap py-8">
      <h1 className="text-2xl font-bold text-sawaka-700 mb-6">
        💡 Assistant Budget
      </h1>

      <form onSubmit={handleSubmit} className="flex gap-4 mb-6">
        <input
          type="number"
          value={montant}
          onChange={(e) => setMontant(e.target.value)}
          placeholder="Entrez votre budget (FCFA)"
          className="border rounded-lg px-4 py-2 flex-1"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 rounded-lg bg-sawaka-600 text-white font-semibold"
        >
          {loading ? "Chargement..." : "Voir suggestions"}
        </button>
      </form>

      {result && (
        <div className="bg-cream-50 p-4 rounded-lg shadow">
          {result.error && (
            <p className="text-red-600">{result.error}</p>
          )}
          {result.projet && (
            <>
              <p className="font-medium mb-2">{result.projet}</p>
              <ul className="space-y-2">
                {result.produits?.map((p: any) => (
                  <li key={p._id} className="flex justify-between">
                    <span>{p.title}</span>
                    <span>{p.price} FCFA</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-sawaka-600">
                Total utilisé : <strong>{result.totalUtilise} FCFA</strong> / {result.budget} FCFA
              </p>
              {result.restant > 0 && (
                <p className="text-sm">Reste : {result.restant} FCFA</p>
              )}
            </>
          )}
        </div>
      )}
    </main>
  );
}
