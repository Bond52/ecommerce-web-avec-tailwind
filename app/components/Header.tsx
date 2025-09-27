'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { Article } from "../lib/apiSeller";

type CartItem = Article & { quantity: number };

export default function Header() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <header className="border-b border-cream-200">
      <div className="wrap py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-xl md:text-2xl tracking-tight text-sawaka-800">
            Sawaka
          </span>
        </Link>

        <nav className="nav">
          <Link href="/" className="nav-link">Accueil</Link>
          <Link href="/boutique" className="nav-link">Boutique</Link>
          <Link href="/artisans" className="nav-link">Nos artisans</Link>
          <Link href="/apropos" className="nav-link">À propos</Link>
          <Link href="/contact" className="nav-link">Contact</Link>

          <Link href="/login" className="btn-outline btn-small">Se connecter</Link>

          <Link href="/panier" className="relative btn-outline btn-small">
            Mon panier
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-sawaka-500 text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
