'use client'

import { useEffect, useState } from "react"
import { Article } from "../lib/apiSeller"

type CartItem = Article & { quantity: number }

export default function PanierPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [message, setMessage] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("cart")
    if (saved) setCart(JSON.parse(saved))
  }, [])

  // 🔄 Sauvegarder dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0)

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item =>
          item._id === id
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
        .filter(item => item.quantity > 0)
    )
  }

  const removeItem = (id: string) => {
    setCart(prev => prev.filter(item => item._id !== id))
  }

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
    <div className="container mx-auto p-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-brown-800 mb-6 flex items-center gap-2">
          🛒 Mon Panier
        </h1>

        {cart.length === 0 ? (
          <p className="text-gray-600">Votre panier est vide.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {cart.map(item => (
              <li
                key={item._id}
                className="flex items-center justify-between py-3"
              >
                {/* Bloc gauche : image + infos */}
                <div className="flex items-center gap-4">
                  {item.images && item.images.length > 0 && (
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <p className="font-medium text-gray-800">{item.title}</p>
                    <p className="text-sm text-gray-500">
                      {item.price}$ × {item.quantity}
                    </p>
                  </div>
                </div>

                {/* Bloc droit : quantité + total */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item._id, -1)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    –
                  </button>
                  <span className="font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, 1)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                  <p className="font-semibold text-gray-900 w-16 text-right">
                    {item.price * item.quantity}$
                  </p>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Total */}
        <div className="flex justify-between items-center mt-6 border-t pt-4">
          <h2 className="text-xl font-bold text-gray-800">Total</h2>
          <span className="text-2xl font-extrabold text-green-600">{total}$</span>
        </div>

        {/* Bouton passer commande */}
        <div className="mt-6">
          <button
            onClick={passerCommande}
            disabled={cart.length === 0}
            className={`w-full px-6 py-3 rounded-lg font-semibold transition
              ${cart.length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-brown-700 text-white hover:bg-brown-800"}`}
          >
            Passer commande
          </button>
        </div>

        {message && (
          <p className="mt-4 font-medium text-gray-700 text-center">{message}</p>
        )}
      </div>
    </div>
  )
}
