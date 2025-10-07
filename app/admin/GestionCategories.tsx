"use client";
import { useEffect, useState } from "react";

export default function GestionCategories() {
  const [type, setType] = useState("produit");
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/categories?type=${type}`, { credentials: "include" })
      .then(res => res.json())
      .then(setCategories);
  }, [type]);

  const addCategory = async () => {
    if (!newCat.trim()) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name: newCat, type }),
    });
    const cat = await res.json();
    setCategories([...categories, cat]);
    setNewCat("");
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Gestion des catégories</h2>
      <div className="flex gap-3 mb-4">
        <button onClick={() => setType("produit")} className={type === "produit" ? "font-bold" : ""}>
          🏭 Produits
        </button>
        <button onClick={() => setType("vente")} className={type === "vente" ? "font-bold" : ""}>
          🛒 Ventes
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          value={newCat}
          onChange={e => setNewCat(e.target.value)}
          placeholder={`Nouvelle catégorie ${type}`}
          className="border p-1 rounded flex-1"
        />
        <button onClick={addCategory} className="bg-brown-600 text-white px-3 rounded">Ajouter</button>
      </div>

      <ul className="list-disc ml-6">
        {categories.map((c: any) => <li key={c._id}>{c.name}</li>)}
      </ul>
    </div>
  );
}
