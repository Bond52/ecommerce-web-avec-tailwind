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

      {/* ===================== HERO SECTION ===================== */}
      <section className="section bg-white">
        <div className="wrap grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* TEXT */}
          <div>
            <div className="mb-4 text-sm uppercase tracking-widest text-brown-700">
              Artisanat authentique
            </div>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              Découvrez l’art <span className="text-gradient">authentique</span>
            </h1>

            <p className="text-lg text-brown-700 mb-8 max-w-xl">
              Connectez-vous directement avec les artisans du Cameroun et trouvez des créations
              uniques faites avec passion.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/produits" className="btn btn-primary">
                Explorer les produits
              </Link>

              <Link href="/artisans" className="btn btn-outline">
                Rencontrer les artisans
              </Link>
            </div>

            {/* STATS */}
            <div className="mt-12 grid grid-cols-3 gap-6 pt-8 border-t border-sand-300">
              <div className="text-center">
                <div className="text-3xl font-bold text-brown-900">
                  {articles.length || 50}+
                </div>
                <div className="text-sm text-brown-700">Produits</div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-brown-900">25+</div>
                <div className="text-sm text-brown-700">Artisans</div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-brown-900">500+</div>
                <div className="text-sm text-brown-700">Clients satisfaits</div>
              </div>
            </div>
          </div>

          {/* RIGHT + placeholder grid */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square rounded-xl bg-sand-200"></div>
              <div className="aspect-square rounded-xl bg-sand-300"></div>
              <div className="aspect-square rounded-xl bg-sand-300"></div>
              <div className="aspect-square rounded-xl bg-sand-200"></div>
            </div>
          </div>
        </div>
      </section>



      {/* ===================== CATEGORIES ===================== */}
      <section className="section">
        <div className="wrap">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-3">Explorez par catégorie</h2>
            <p className="text-lg text-brown-700 max-w-xl mx-auto">
              Découvrez nos catégories de produits artisanaux
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">

            {[
              { name: 'Mode', href: '/produits?category=mode', img: '/images/icons/mode.png' },
              { name: 'Maison', href: '/produits?category=maison', img: '/images/icons/maison.png' },
              { name: 'Art', href: '/produits?category=art', img: '/images/icons/art.png' },
              { name: 'Bijoux', href: '/produits?category=bijoux', img: '/images/icons/bijoux.png' },
              { name: 'Beauté', href: '/produits?category=beaute', img: '/images/icons/beaute.png' },
              { name: 'Textile', href: '/produits?category=textile', img: '/images/icons/textile.png' }
            ].map((cat, i) => (
              <Link
                key={i}
                href={cat.href}
                className="category-card group"
              >
                <div className="category-icon">
                  <img src={cat.img} alt={cat.name} className="w-10 h-10 opacity-90" />
                </div>
                <h3 className="font-semibold text-brown-900 group-hover:text-brown-700">
                  {cat.name}
                </h3>
              </Link>
            ))}

          </div>
        </div>
      </section>



      {/* ===================== POPULAR PRODUCTS ===================== */}
      <section className="section">
        <div className="wrap">

          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-4xl font-bold mb-2">Nos créations populaires</h2>
              <p className="text-brown-700">Les produits préférés de nos clients</p>
            </div>

            <Link href="/produits" className="text-brown-700 hover:text-brown-900 font-medium hidden md:flex">
              Voir tout →
            </Link>
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-brown-700 text-lg">Chargement des produits...</p>
            </div>
          ) : (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

              {articles.slice(0, 8).map(article => (
                <div key={article._id} className="card group">

                  {/* IMAGE */}
                  <div className="card-thumb">
                    {article.images?.[0] ? (
                      <img src={article.images[0]} alt={article.title} />
                    ) : (
                      <span className="text-brown-600 text-4xl opacity-40">📦</span>
                    )}
                  </div>

                  {/* INFO */}
                  <div className="card-body">

                    <h3 className="card-title mb-1 line-clamp-2">
                      {article.title}
                    </h3>

                    {article.categories?.[0] && (
                      <p className="text-sm text-brown-600 mb-2">
                        {article.categories[0]}
                      </p>
                    )}

                    <div className="flex items-center justify-between mb-3">
                      <div className="price text-xl">
                        {article.price.toLocaleString()} FCFA
                      </div>
                      <div className="text-sm text-brown-600">★★★★★</div>
                    </div>

                    {article.stock <= 5 && article.stock > 0 && (
                      <div className="text-xs text-amber-600 mb-3">
                        Plus que {article.stock} en stock
                      </div>
                    )}

                    <button
                      onClick={() => addToCart(article)}
                      disabled={article.stock <= 0}
                      className={`
                        w-full btn 
                        ${article.stock <= 0
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'btn-primary'
                        }
                      `}
                    >
                      {article.stock <= 0 ? 'Rupture de stock' : 'Ajouter au panier'}
                    </button>

                  </div>
                </div>
              ))}

            </div>
          )}

        </div>
      </section>



      {/* ===================== HOW IT WORKS ===================== */}
      <section className="section section-muted">
        <div className="wrap text-center">

          <h2 className="text-4xl font-bold mb-3">Comment ça marche</h2>
          <p className="text-lg text-brown-700 mb-12">
            Un processus simple et fiable pour commander auprès d’artisans locaux
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

            <div className="howit-card">
              <div className="icon-circle mb-4">🔍</div>
              <div className="howit-title">Parcourez & Commandez</div>
              <div className="howit-text">Trouvez des créations uniques</div>
            </div>

            <div className="howit-card">
              <div className="icon-circle mb-4">🛠</div>
              <div className="howit-title">Préparation artisanale</div>
              <div className="howit-text">Chaque article est fabriqué avec soin</div>
            </div>

            <div className="howit-card">
              <div className="icon-circle mb-4">🚚</div>
              <div className="howit-title">Collecte rapide</div>
              <div className="howit-text">Livraison ou retrait simple</div>
            </div>

            <div className="howit-card">
              <div className="icon-circle mb-4">📦</div>
              <div className="howit-title">Retirez près de chez vous</div>
              <div className="howit-text">Récupérez facilement votre commande</div>
            </div>

          </div>

        </div>
      </section>

    </>
  );
}
