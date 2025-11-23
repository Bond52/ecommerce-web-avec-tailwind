"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Article } from "../lib/apiSeller";

type CartItem = Article & { quantity: number };
type UserData = {
  token: string;
  roles: string[];
  username: string;
  firstName?: string;
  lastName?: string;
};

export default function Header() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<UserData | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));

    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));

    const handleStorageChange = () => {
      const u = localStorage.getItem("user");
      setUser(u ? JSON.parse(u) : null);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  const handleLogout = () => {
    localStorage.removeItem("user");
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

  const isAdmin = user?.roles?.includes("admin");

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
              <Link href="/aide" className="hover:text-sawaka-200">Aide</Link>
              <Link href="/contact" className="hover:text-sawaka-200">Contact</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="wrap py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-2xl font-bold text-sawaka-700">Sawaka</span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-4 pr-12 rounded-lg border-2 border-cream-200 focus:border-sawaka-500 focus:ring-0"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-sawaka-500 text-white rounded-md">
              🔍
            </button>
          </div>
        </form>

        {/* User */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-cream-100"
              >
                <div className="w-8 h-8 bg-sawaka-500 rounded-full flex items-center justify-center text-white">
                  {user.firstName?.charAt(0) || user.username.charAt(0)}
                </div>

                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-sawaka-800">
                    Bonjour, {user.firstName || user.username}
                  </div>
                  <div className="text-xs text-sawaka-600">
                    {user.roles.join(", ")}
                  </div>
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border rounded-lg shadow-lg py-2 z-50">
                  <Link href="/profile" className="block px-4 py-2 hover:bg-cream-50">👤 Mon Profil</Link>
                  <Link href="/vendeur/articles" className="block px-4 py-2 hover:bg-cream-50">🛍️ Mes créations</Link>

                  {isAdmin && (
                    <>
                      <hr className="my-2" />
                      <Link href="/admin" className="block px-4 py-2 hover:bg-cream-50 font-semibold text-sawaka-700">
                        ⚙️ Gestion (Admin)
                      </Link>
                    </>
                  )}

                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    🚪 Déconnexion
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="px-4 py-2 border rounded-lg hover:bg-cream-100">
              👤 Se connecter
            </Link>
          )}
        </div>
      </div>

      {/* NAV BAR — NO CATEGORIES */}
      <div className="border-t bg-cream-50">
        <div className="wrap py-3 flex gap-8 text-sm items-center whitespace-nowrap">

          {/* Catégories désactivé */}
          {/* 
          <button className="px-4 py-2 bg-sawaka-500 text-white rounded-lg">
            ☰ Catégories
          </button>
          */}

          <Link href="/">Accueil</Link>
          <Link href="/artisans">Artisans</Link>
          <Link href="/produits">Produits</Link>
          <Link href="/nouveautes">Nouveautés</Link>
          <Link href="/promotions">Promotions</Link>

          <Link href="/encheres" className="text-sawaka-700 hover:text-sawaka-900">
            Ventes aux enchères
          </Link>

          <Link href="/fournisseurs">Fournisseurs</Link>
          <Link href="/projets">Projets en cours</Link>
          <Link href="/arbre">L’Arbre à outils</Link>

          <Link href="/amelioration">Améliorer Sawaka</Link>
        </div>
      </div>
    </header>
  );
}
