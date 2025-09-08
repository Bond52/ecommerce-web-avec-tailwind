'use client';

import { useEffect, useState } from "react";
import { Article } from "../lib/apiSeller";

type CartItem = Article & { quantity: number };

export default function PanierPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const passerCommande = async () => {
    const token = localStorage.getItem("auth_token");
    const role = localStorage.getItem("role");

    // 🔒 Vérifie si connecté
    if (!token || role !== "acheteur") {
      alert("Veuillez vous connecter en tant qu'acheteur pour passer une commande.");
      window.location.href = "/login?redirect=/panier";
      return;
    }

    try {
      const res = await fetch(
        (process.env.NEXT_PUBLIC_API_BASE ?? "https://ecommerce-web-avec-tailwind.onrender.com") + "/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // 🔑 envoi du JWT
          },
          body: JSON.stringify({
            items: cart.map(item => ({
              articleId: item._id,    // 👈 important pour Mongo
              title: item.title,
              price: item.price,
              quantity: item.quantity,
            })),
          }),
        }
      );

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();

      // ✅ Vérifie que la commande a bien été créée
      if (data && data._id) {
        setMessage("✅ Commande créée avec succès !");
        localStorage.removeItem("cart");
        setCart([]);
      } else {
        throw new Error("Réponse invalide du serveur");
      }
    } catch (err: any) {
      setMessage("❌ Erreur: " + err.message);
    }
  };

  return (
    <div>
      <h1>🛒 Mon Panier</h1>

      {cart.length === 0 && <p>Votre panier est vide.</p>}

      <ul>
        {cart.map(item => (
          <li key={item._id}>
            {item.title} – {item.price}$ x {item.quantity}
          </li>
        ))}
      </ul>

      <h2>Total: {total}$</h2>

      <button onClick={passerCommande} disabled={cart.length === 0}>
        Passer commande
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}
