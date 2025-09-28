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
    <>
      {/* ===== Hero Section ===== */}
      <section className="relative bg-gradient-to-br from-sawaka-50 via-cream-100 to-sawaka-100 py-12 md:py-20">
        <div className="wrap">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-sawaka-500 text-white rounded-full text-sm font-medium mb-6">
                ✨ Artisanat authentique du Cameroun
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-sawaka-800 leading-tight mb-6">
                Découvrez l'art
                <span className="block text-gradient">authentique</span>
              </h1>
              <p className="text-lg text-sawaka-600 mb-8 max-w-xl">
                Connectez-vous directement avec les artisans du Cameroun. Des créations uniques, 
                faites à la main avec amour et livrées avec soin.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/produits" className="btn-sawaka inline-flex items-center gap-2 rounded-lg px-4 py-2 bg-sawaka-500 text-white hover:bg-sawaka-600 transition-colors">
                  🛍️ Explorer les produits
                </Link>
                <Link href="/artisans" className="btn-outline inline-flex items-center gap-2 rounded-lg px-4 py-2 hover:bg-sawaka-100 transition-colors">
                  👥 Rencontrer les artisans
                </Link>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-sawaka-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-sawaka-700">{articles.length || '50'}+</div>
                  <div className="text-sm text-sawaka-600">Produits</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-sawaka-700">25+</div>
                  <div className="text-sm text-sawaka-600">Artisans</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-sawaka-700">500+</div>
                  <div className="text-sm text-sawaka-600">Clients</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-white p-8 shadow-xl">
                <div className="grid grid-cols-2 gap-4 h-full">
                  <div className="bg-sawaka-100 rounded-xl flex items-center justify-center text-4xl">
                    🏺
                  </div>
                  <div className="bg-cream-200 rounded-xl flex items-center justify-center text-4xl">
                    👗
                  </div>
                  <div className="bg-sawaka-200 rounded-xl flex items-center justify-center text-4xl">
                    💎
                  </div>
                  <div className="bg-cream-100 rounded-xl flex items-center justify-center text-4xl">
                    🎨
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-sawaka-500 rounded-full flex items-center justify-center text-white text-xl">
                ✨
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Categories Grid ===== */}
      <section className="py-12 md:py-16">
        <div className="wrap">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-sawaka-800 mb-4">
              Explorez par catégorie
            </h2>
            <p className="text-lg text-sawaka-600 max-w-2xl mx-auto">
              Découvrez notre large sélection de produits artisanaux authentiques
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {[
              { name: 'Mode', icon: '👗', href: '/produits?category=mode', bg: 'bg-purple-100' },
              { name: 'Maison', icon: '🏠', href: '/produits?category=maison', bg: 'bg-blue-100' },
              { name: 'Art', icon: '🎨', href: '/produits?category=art', bg: 'bg-green-100' },
              { name: 'Bijoux', icon: '💎', href: '/produits?category=bijoux', bg: 'bg-pink-100' },
              { name: 'Beauté', icon: '🌸', href: '/produits?category=beaute', bg: 'bg-orange-100' },
              { name: 'Textile', icon: '🧵', href: '/produits?category=textile', bg: 'bg-indigo-100' }
            ].map((category, index) => (
              <Link
                key={index}
                href={category.href}
                className="group p-6 bg-white rounded-xl border border-cream-200 hover:border-sawaka-300 hover:shadow-lg transition-all duration-300 text-center"
              >
                <div className={`w-16 h-16 ${category.bg} rounded-full flex items-center justify-center text-2xl mb-4 mx-auto group-hover:scale-110 transition-transform`}>
                  {category.icon}
                </div>
                <h3 className="font-semibold text-sawaka-800 group-hover:text-sawaka-600 transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Featured Products ===== */}
      <section className="py-12 md:py-16">
        <div className="wrap">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-sawaka-800 mb-2">
                Nos créations populaires
              </h2>
              <p className="text-lg text-sawaka-600">
                Découvrez les produits les plus appréciés par nos clients
              </p>
            </div>
            <Link 
              href="/produits" 
              className="hidden sm:inline-flex items-center gap-2 text-sawaka-700 hover:text-sawaka-800 font-medium"
            >
              Voir tout
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📦</span>
              </div>
              <p className="text-sawaka-700 text-lg">Chargement des produits...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {articles.slice(0, 8).map(article => (
                <div key={article._id} className="group bg-white rounded-xl border border-cream-200 overflow-hidden hover:border-sawaka-300 hover:shadow-lg transition-all duration-300">
                  {/* Product Image */}
                  <div className="aspect-square bg-cream-100 relative overflow-hidden">
                    {article.images && article.images.length > 0 ? (
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
                    {/* Quick actions */}
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

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-sawaka-800 mb-1 line-clamp-2 group-hover:text-sawaka-600 transition-colors">
                      {article.title}
                    </h3>
                    
                    {article.categories && article.categories.length > 0 && (
                      <p className="text-sm text-sawaka-500 mb-2">
                        {article.categories[0]}
                      </p>
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

                    {/* Stock indicator */}
                    {article.stock <= 5 && article.stock > 0 && (
                      <div className="text-xs text-amber-600 mb-3">
                        Plus que {article.stock} en stock
                      </div>
                    )}

                    <button
                      onClick={() => addToCart(article)}
                      disabled={article.stock <= 0}
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                        article.stock <= 0
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-sawaka-500 text-white hover:bg-sawaka-600'
                      }`}
                    >
                      {article.stock <= 0 ? 'Rupture de stock' : '🛒 Ajouter au panier'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Show more button */}
          <div className="text-center mt-12">
            <Link href="/produits" className="bg-sawaka-500 rounded-lg px-4 py-2 hover:bg-sawaka-600 text-white transition-colors">
              Voir tous les produits
            </Link>
          </div>
        </div>
      </section>

      {/* ===== How it Works ===== */}
      <section className="py-12 md:py-16 bg-cream-50">
        <div className="wrap">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-sawaka-800 mb-4">
              Comment ça marche
            </h2>
            <p className="text-lg text-sawaka-600 max-w-2xl mx-auto">
              Un processus simple et sécurisé pour vous connecter aux artisans locaux
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-sawaka-500 rounded-full flex items-center justify-center text-3xl mb-6 mx-auto group-hover:scale-110 transition-transform">
                🔎
              </div>
              <h3 className="text-xl font-semibold text-sawaka-800 mb-3">Parcourez & Commandez</h3>
              <p className="text-sawaka-600">Trouvez l'article unique qui vous plaît parmi notre collection</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-sawaka-500 rounded-full flex items-center justify-center text-3xl mb-6 mx-auto group-hover:scale-110 transition-transform">
                🛠️
              </div>
              <h3 className="text-xl font-semibold text-sawaka-800 mb-3">L'artisan prépare</h3>
              <p className="text-sawaka-600">Votre commande est préparée avec soin par l'artisan</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-sawaka-500 rounded-full flex items-center justify-center text-3xl mb-6 mx-auto group-hover:scale-110 transition-transform">
                ⚡
              </div>
              <h3 className="text-xl font-semibold text-sawaka-800 mb-3">Collecte rapide</h3>
              <p className="text-sawaka-600">Notre réseau de chauffeurs collecte votre commande</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-sawaka-500 rounded-full flex items-center justify-center text-3xl mb-6 mx-auto group-hover:scale-110 transition-transform">
                📦
              </div>
              <h3 className="text-xl font-semibold text-sawaka-800 mb-3">Retrait pratique</h3>
              <p className="text-sawaka-600">Récupérez votre commande près de chez vous</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}