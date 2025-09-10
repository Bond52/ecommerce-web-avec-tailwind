'use client';

import { useEffect, useState } from "react";

type Order = {
  _id: string;
  total: number;
  status: string;
  createdAt: string;
  items: {
    articleId: string;
    title: string;
    price: number;
    quantity: number;
  }[];
};

export default function MesCommandesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const role = localStorage.getItem("role");

    if (!token || role !== "acheteur") {
      window.location.href = "/login?redirect=/acheteur/commandes";
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(
          (process.env.NEXT_PUBLIC_API_BASE ?? "https://ecommerce-web-avec-tailwind.onrender.com") + "/api/orders",
          {
            headers: { Authorization: `Bearer ${token}` },
            credentials: "include",
          }
        );
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setOrders(data);
      } catch (err: any) {
        setError("Impossible de charger vos commandes.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>⏳ Chargement...</p>;
  if (error) return <p>❌ {error}</p>;

  return (
    <div>
      <h1>📦 Mes commandes</h1>
      {orders.length === 0 && <p>Aucune commande pour l’instant.</p>}
      <ul>
        {orders.map(order => (
          <li key={order._id}>
            <strong>Commande {order._id}</strong> – {order.total}$ – {order.status} <br />
            <ul>
              {order.items.map((it, i) => (
                <li key={i}>
                  {it.title} – {it.price}$ x {it.quantity}
                </li>
              ))}
            </ul>
            <small>Créée le {new Date(order.createdAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
