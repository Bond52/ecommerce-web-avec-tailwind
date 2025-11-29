"use client";

import { useEffect, useState } from "react";
import { getFournisseurs, Fournisseur } from "@/app/lib/apiFournisseurs";

export default function FournisseursPage() {
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFournisseurs()
      .then((res) => setFournisseurs(res))
      .catch((err) => console.error("Erreur fournisseurs :", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="wrap py-12">
        <p className="text-sawaka-600 text-lg">Chargement des fournisseurs...</p>
      </div>
    );
  }

  return (
    <div className="wrap py-12">
      <h1 className="text-3xl font-bold text-sawaka-700 mb-4">Fournisseurs</h1>

      <p className="text-sawaka-700 text-lg leading-relaxed max-w-2xl">
        Voici une liste de fournisseurs de matières premières, bois,
        quincaillerie et accessoires nécessaires à la création artisanale.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {fournisseurs.map((f) => (
          <div
            key={f._id}
            className="bg-white border border-cream-300 rounded-lg p-4 shadow-sm"
          >
            <div className="flex items-center mb-3">
              {f.logo ? (
                <img
                  src={f.logo}
                  alt={f.nom}
                  className="w-12 h-12 object-contain mr-3"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-200 rounded mr-3" />
              )}
              <div>
                <h2 className="text-xl font-semibold text-sawaka-700">{f.nom}</h2>
                <p className="text-sawaka-500 text-sm">{f.categorie}</p>
              </div>
            </div>

            <p className="text-sawaka-600 text-sm mb-2">
              <strong>Produits :</strong> {f.produits.join(", ")}
            </p>

            <p className="text-sawaka-600 text-sm">
              📍 {f.adresse}
              <br />
              📞 {f.telephone}
              <br />
              ✉️ {f.email}
            </p>

            <p className="text-sawaka-500 text-sm mt-2">
              Délai de livraison : {f.delaiLivraison}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
