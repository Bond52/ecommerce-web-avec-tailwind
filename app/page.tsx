'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { listPublicArticles, Article } from './lib/apiSeller';

type CartItem = Article & { quantity: number };

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

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
    <div className="min-h-screen bg-white text-sawaka-900">

      {/* ===== Hero ===== */}
      <section className="hero">
        <div className="wrap">
          <div className="hero-eyebrow">ARTISANAT AUTHENTIQUE CAMEROUNAIS</div>
          <h1 className="hero-title">
            Découvrez l’art <span className="text-gradient font-bold">authentique</span>
          </h1>
          <p className="hero-sub max-w-2xl mx-auto">
            Connectez-vous directement avec les artisans du Cameroun. Des créations uniques,
            livrées avec soin.
          </p>
          <div className="mt-6 flex items-center justify-center">
            <Link href="/boutique" className="btn-primary">
              Découvrir la collection
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Section "Comment ça marche" ===== */}
      <section className="section section-muted">
        <div className="wrap">
          <h2 className="text-center mb-1">Comment ça marche</h2>
          <p className="text-center text-sm text-sawaka-700 mb-8">
            Un processus simple et sécurisé pour vous connecter aux artisans locaux
          </p>

          <div className="grid-steps">
            <div className="howit-card">
              <div className="icon-circle">🔎</div>
              <div className="howit-title">Parcourez & Commandez</div>
              <p className="howit-text">Trouvez l’article unique qui vous plaît</p>
            </div>
            <div className="howit-card">
              <div className="icon-circle">🛠️</div>
              <div className="howit-title">L’artisan prépare</div>
              <p className="howit-text">Votre commande est préparée avec soin</p>
            </div>
            <div className="howit-card">
              <div className="icon-circle">⚡</div>
              <div className="howit-title">Collecte rapide</div>
              <p className="howit-text">Notre réseau de chauffeurs collecte</p>
            </div>
            <div className="howit-card">
              <div className="icon-circle">📦</div>
              <div className="howit-title">Retrait pratique</div>
              <p className="howit-text">Récupérez près de chez vous</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Produits ===== */}
      <main className="section">
        <div className="wrap">
          <h2 className="text-center mb-1">Nos créations</h2>
          <p className="text-center text-sm text-sawaka-700 mb-8">
            Découvrez une sélection d’articles authentiques
          </p>

          {articles.length === 0 ? (
            <p className="text-sawaka-700 text-center">Aucun article publié pour l’instant.</p>
          ) : (
            <div className="grid-products">
              {articles.map(article => (
                <article key={article._id} className="card flex flex-col">
                  <div className="card-thumb">
                    {/* placeholder image, à remplacer si tu as imageUrl */}
                    <span className="text-2xl">📦</span>
                  </div>

                  <div className="card-body grow flex flex-col">
                    <h3 className="card-title">{article.title}</h3>
                    <div className="card-sub">Artisan • Cameroun</div>

                    {article.description && (
                      <p className="card-desc mt-2 line-clamp-3">{article.description}</p>
                    )}

                    <div className="mt-4 flex items-center justify-between">
                      <span className="price">{article.price} FCFA</span>
                      <button
                        onClick={() => addToCart(article)}
                        className="btn-primary btn-small"
                      >
                        Ajouter
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
