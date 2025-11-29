'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { listPublicArticles, Article } from './lib/apiSeller';

// Import dynamique carte (SSR fix)
const CameroonMap = dynamic(() => import('./components/CameroonMap'), { ssr: false });

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

  // -----------------------------------------------------
  //                        RENDER
  // -----------------------------------------------------
  return (
    <>
      {/* ===== Hero Section ===== */}
      <section className="relative bg-gradient-to-br from-sawaka-50 via-cream-100 to-sawaka-100 py-12 md:py-20">
        {/* ... rien changé ... */}
      </section>

      {/* ===== Map Section ===== */}
      <section className="py-12 md:py-16">
        <CameroonMap />
      </section>

      {/* ===== Categories ===== */}
      <section className="py-12 md:py-16">
        {/* ... rien changé ... */}
      </section>

      {/* ========================================================================= */}
      {/*                      ⭐ FEATURED PRODUCTS — MODIFIÉ                       */}
      {/* ========================================================================= */}
      <section className="py-12 md:py-16">
        <div className="wrap">

          {/* ⭐ NOUVEL EN-TÊTE CENTRÉ ⭐ */}
          <div className="text-center mb-12 relative">
            <h2 className="text-3xl md:text-4xl font-bold text-sawaka-800 mb-2">
              Créations populaires
            </h2>
            <p className="text-lg text-sawaka-600">
              Découvrez les produits les plus appréciés
            </p>

            {/* Lien repositionné à droite */}
            <Link
              href="/produits"
              className="hidden sm:inline-flex items-center gap-2 text-sawaka-700 hover:text-sawaka-800 font-medium absolute right-0 top-1/2 -translate-y-1/2"
            >
              Voir tout
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* PRODUITS */}
          {articles.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📦</span>
              </div>
              <p className="text-sawaka-700 text-lg">Chargement des produits...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...articles]
                .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
                .slice(0, 4)
                .map(article => (
                  <div
                    key={article._id}
                    className="group bg-white rounded-xl border border-cream-200 overflow-hidden hover:border-sawaka-300 hover:shadow-lg transition-all duration-300"
                  >
                    {/* CARD */}
                    <div className="aspect-square bg-cream-100 relative overflow-hidden">
                      {article.images?.length > 0 ? (
                        <img
                          src={article.images[0]}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl text-sawaka-300">
                          📦
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                        <Link
                          href={`/produits/${article._id}`}
                          className="bg-white rounded-full p-2 hover:bg-sawaka-50 transition-colors"
                        >
                          <svg className="w-5 h-5 text-sawaka-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-sawaka-800 mb-1 line-clamp-2 group-hover:text-sawaka-600 transition-colors">
                        {article.title}
                      </h3>

                      {article.categories?.length > 0 && (
                        <p className="text-sm text-sawaka-500 mb-2">{article.categories[0]}</p>
                      )}

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1">
                          <span className="text-2xl font-bold text-sawaka-800">
                            {article.price.toLocaleString()}
                          </span>
                          <span className="text-sm text-sawaka-600">FCFA</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <span className="text-sawaka-500 text-sm">★★★★★</span>
                          <span className="text-sawaka-600 text-sm">(4.8)</span>
                        </div>
                      </div>

                      {article.stock <= 5 && article.stock > 0 && (
                        <div className="text-xs text-amber-600 mb-3">
                          Plus que {article.stock} en stock
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/produits"
              className="bg-sawaka-500 rounded-lg px-4 py-2 hover:bg-sawaka-600 text-white transition-colors"
            >
              Voir tous les produits
            </Link>
          </div>
        </div>
      </section>

      {/* ===== How it Works ===== */}
      <section className="py-12 md:py-16 bg-cream-50">
        {/* ... rien changé ... */}
      </section>
    </>
  );
}
