'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { listPublicArticles, Article } from './lib/apiSeller';

type CartItem = Article & { quantity: number };

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Charger articles + panier
  useEffect(() => {
    listPublicArticles().then(setArticles).catch(console.error);

    const saved = localStorage.getItem('cart');
    if (saved) setCart(JSON.parse(saved));
  }, []);

  const addToCart = (article: Article) => {
    setCart(prev => {
      const exists = prev.find(item => item._id === article._id);
      let updated: CartItem[];
      if (exists) {
        updated = prev.map(item =>
          item._id === article._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updated = [...prev, { ...article, quantity: 1 }];
      }
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🔹 Header */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold">Sawaka</h1>

          <nav className="flex items-center gap-6">
            <Link href="/login" className="hover:underline">
              Se connecter
            </Link>
            <Link
              href="/panier"
              className="relative flex items-center hover:underline"
            >
              <span>Mon Panier</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-yellow-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </header>

      {/* 🔹 Hero section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-20 text-center">
        <h2 className="text-4xl font-extrabold mb-4">
          Bienvenue sur Sawaka 🛍️
        </h2>
        <p className="text-lg">
          Découvrez nos articles et profitez d’une expérience d’achat simple et rapide.
        </p>
      </section>

      {/* 🔹 Liste des articles */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <h3 className="text-2xl font-semibold mb-6">Articles disponibles</h3>
        {articles.length === 0 ? (
          <p className="text-gray-500">Aucun article publié pour l’instant.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {articles.map(article => (
              <div
                key={article._id}
                className="bg-white shadow rounded-lg p-4 flex flex-col justify-between hover:shadow-lg transition"
              >
                <div>
                  <h4 className="font-bold text-lg mb-2">{article.title}</h4>
                  <p className="text-gray-600 mb-4">{article.price} $</p>
                </div>
                <button
                  onClick={() => addToCart(article)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded mt-auto"
                >
                  Ajouter au panier
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
