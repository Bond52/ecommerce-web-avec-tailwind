"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Article } from "../lib/apiSeller";

type CartItem = Article & { quantity: number };

export default function Header() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<{ token: string; role: string } | null>(
    null
  );
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Load cart
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));

    // Check authentication status
    const token = localStorage.getItem("auth_token");
    const role = localStorage.getItem("role");
    if (token && role) {
      setUser({ token, role });
    }

    // Listen for storage changes (login/logout from other tabs)
    const handleStorageChange = () => {
      const token = localStorage.getItem("auth_token");
      const role = localStorage.getItem("role");
      if (token && role) {
        setUser({ token, role });
      } else {
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("role");
    setUser(null);
    setShowUserMenu(false);
    router.push("/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/produits?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const getUserDashboard = () => {
    switch (user?.role) {
      case "admin":
        return "/admin";
      case "vendeur":
        return "/vendeur";
      case "acheteur":
        return "/acheteur";
      default:
        return "/";
    }
  };

  const getRoleLabel = () => {
    switch (user?.role) {
      case "admin":
        return "Admin";
      case "vendeur":
        return "Vendeur";
      case "acheteur":
        return "Acheteur";
      default:
        return "";
    }
  };

  const categories = [
    { name: "Mode & Accessoires", href: "/produits?category=mode" },
    { name: "Maison & Décoration", href: "/produits?category=maison" },
    { name: "Art & Artisanat", href: "/produits?category=art" },
    { name: "Beauté & Bien-être", href: "/produits?category=beaute" },
    { name: "Bijoux", href: "/produits?category=bijoux" },
    { name: "Textile", href: "/produits?category=textile" },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-cream-200 sticky top-0 z-40">
      {/* Top Bar */}
      <div className="bg-sawaka-700 text-white">
        <div className="wrap py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span>📦 Livraison gratuite dès 50 000 FCFA</span>
              <span>🛡️ Garantie artisan</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/aide" className="hover:text-sawaka-200">
                Aide
              </Link>
              <Link href="/contact" className="hover:text-sawaka-200">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="wrap py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <img
              src="/images/logo.jpg"
              alt="Sawaka"
              className="w-10 h-10 rounded-lg"
            />
            <span className="font-display text-2xl font-bold tracking-tight text-sawaka-700">
              Sawaka
            </span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher des produits artisanaux..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 pl-4 pr-12 rounded-lg border-2 border-cream-200 focus:border-sawaka-500 focus:ring-0 text-sawaka-800 placeholder-sawaka-400"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-sawaka-500 text-white rounded-md hover:bg-sawaka-600 transition-colors flex items-center justify-center"
              >
                🔍
              </button>
            </div>
          </form>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-cream-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-sawaka-500 rounded-full flex items-center justify-center text-white text-sm">
                    {getRoleLabel().charAt(0)}
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-sawaka-800">
                      Bonjour,
                    </div>
                    <div className="text-xs text-sawaka-600">
                      {getRoleLabel()}
                    </div>
                  </div>
                  <svg
                    className="w-4 h-4 text-sawaka-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-cream-200 rounded-lg shadow-lg py-2 z-50">
                    <Link
                      href={getUserDashboard()}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-sawaka-700 hover:bg-cream-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <span>🏠</span>
                      Mon espace
                    </Link>
                    {user.role === "acheteur" && (
                      <Link
                        href="/acheteur/commandes"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-sawaka-700 hover:bg-cream-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <span>📦</span>
                        Mes commandes
                      </Link>
                    )}
                    {user.role === "vendeur" && (
                      <Link
                        href="/vendeur/articles"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-sawaka-700 hover:bg-cream-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <span>📝</span>
                        Mes articles
                      </Link>
                    )}
                    <hr className="my-2 border-cream-200" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <span>🚪</span>
                      Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-sawaka-700 border border-sawaka-300 rounded-lg hover:bg-sawaka-50 transition-colors"
              >
                <span>👤</span>
                Se connecter
              </Link>
            )}

            {/* Cart */}
            <Link
              href="/panier"
              className="relative p-3 text-sawaka-700 hover:bg-cream-100 rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13v8a2 2 0 002 2h6a2 2 0 002-2v-8"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-sawaka-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="border-t border-cream-200 bg-cream-50">
        <div className="wrap">
          <nav className="flex items-center gap-8 py-3 text-sm">
            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-sawaka-500 text-white rounded-lg hover:bg-sawaka-600 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                Catégories
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showCategoryMenu && (
                <div className="absolute left-0 top-full mt-1 w-64 bg-white border border-cream-200 rounded-lg shadow-lg py-2 z-50">
                  {categories.map((category, index) => (
                    <Link
                      key={index}
                      href={category.href}
                      className="block px-4 py-2 text-sawaka-700 hover:bg-cream-50 transition-colors"
                      onClick={() => setShowCategoryMenu(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation Links */}
            <Link
              href="/"
              className="text-sawaka-700 hover:text-sawaka-800 font-medium transition-colors"
            >
              Accueil
            </Link>
            <Link
              href="/produits"
              className="text-sawaka-700 hover:text-sawaka-800 transition-colors"
            >
              Tous les produits
            </Link>
            <Link
              href="/nouveautes"
              className="text-sawaka-700 hover:text-sawaka-800 transition-colors"
            >
              Nouveautés
            </Link>
            <Link
              href="/promotions"
              className="text-sawaka-700 hover:text-sawaka-800 transition-colors"
            >
              Promotions
            </Link>
            <Link
              href="/artisans"
              className="text-sawaka-700 hover:text-sawaka-800 transition-colors"
            >
              Nos artisans
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
