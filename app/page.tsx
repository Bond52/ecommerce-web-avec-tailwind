'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { listPublicArticles, Article } from './lib/apiSeller';

type CartItem = Article & { quantity: number };

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Charger les articles et le panier au montage
  useEffect(() => {
    listPublicArticles().then(setArticles).catch(console.error);

    const saved = localStorage.getItem('cart');
    if (saved) setCart(JSON.parse(saved));
  }, []);

  // Fonction ajout au panier
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
    <div>
      <h1>Bienvenue sur Sawaka</h1>
      <p>Pour accéder à votre compte, veuillez vous connecter :</p>
      <Link href="/login">
        <button>Se connecter</button>
      </Link>

      <h2>🛍️ Articles disponibles</h2>
      {articles.length === 0 && <p>Aucun article publié pour l’instant.</p>}
      <ul>
        {articles.map(article => (
          <li key={article._id}>
            <strong>{article.title}</strong> – {article.price}$
            <button onClick={() => addToCart(article)}>Ajouter au panier</button>
          </li>
        ))}
      </ul>

      <h2>🛒 Mon Panier ({cart.reduce((s, i) => s + i.quantity, 0)})</h2>
      <ul>
        {cart.map(item => (
          <li key={item._id}>
            {item.title} x {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
}
