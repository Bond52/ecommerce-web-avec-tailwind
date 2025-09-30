'use client'

import { useEffect, useState } from "react"
import AppLayout from "../AppLayout"
import { Article } from "../lib/apiSeller"

type CartItem = Article & { quantity: number }

export default function PanierPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [message, setMessage] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("cart")
    if (saved) setCart(JSON.parse(saved))
  }, [])

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0)

  const passerCommande = async () => {
    const token = localStorage.getItem("auth_token")
    const role = localStorage.getItem("role")

    if (!token || role !== "acheteur") {
      alert("Veuillez vous connecter en tant qu'acheteur pour passer une commande.")
      window.location.href = "/login?redirect=/panier"
      return
    }

    try {
      const res = await fetch(
        (process.env.NEXT_PUBLIC_API_BASE ?? "https://ecommerce-web-avec-tailwind.onrender.com") + "/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: cart.map(item => ({
              articleId: item._id,
              title: item.title,
              price: item.price,
              quantity: item.quantity,
            })),
          }),
        }
      )

      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()

      if (data && data._id) {
        setMessage("✅ Commande créée avec succès !")
        localStorage.removeItem("cart")
        setCart([])
      } else {
        throw new Error("Réponse invalide du serveur")
      }
    } catch (err: any) {
      setMessage("❌ Erreur: " + err.message)
    }
  }

  return (
    <AppLayout>
      <h1 className="text-3xl font-bold text-brown-800 mb-6">🛒 Mon Panier</h1>

      {cart.length === 0 && (
        <p className="text-gray-600">Votre panier est vide.</p>
      )}

      <ul className="space-y-2">
        {cart.map(item => (
          <li
            key={item._id}
            className="flex justify-between border-b py-2 text-gray-700"
          >
            <span>{item.title}</span>
            <span>{item.price}$ x {item.quantity}</span>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mt-6">
        Total: <span className="text-green-600">{total}$</span>
      </h2>

      <button
        onClick={passerCommande}
        disabled={cart.length === 0}
        className="mt-6 bg-brown-700 text-white px-6 py-2 rounded disabled:opacity-50 hover:bg-brown-800"
      >
        Passer commande
      </button>

      {message && (
        <p className="mt-4 font-medium text-gray-700">{message}</p>
      )}
    </AppLayout>
  )
}
