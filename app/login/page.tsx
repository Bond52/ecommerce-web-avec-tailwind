'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const API_URL =
    process.env.NEXT_PUBLIC_API_BASE ||
    (typeof window !== 'undefined' && window.location.hostname === 'localhost'
      ? 'http://localhost:5000'
      : 'https://ecommerce-web-avec-tailwind.onrender.com');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.error || 'Identifiants incorrects');

      if (data.token) localStorage.setItem('auth_token', data.token);
      if (data.role) localStorage.setItem('role', data.role);

      const redirect = searchParams.get('redirect');
      if (redirect) {
        router.push(redirect);
      } else if (data.role === 'admin') {
        router.push('/admin');
      } else if (data.role === 'vendeur') {
        router.push('/vendeur/articles');
      } else if (data.role === 'livreur') {
        router.push('/livreur/commandes');
      } else {
        router.push('/acheteur');
      }
    } catch {
      alert('Erreur de connexion au serveur');
    }
  };

  return (
    <>
      <Header />

      <main className="flex items-center justify-center min-h-[70vh] bg-cream-100">
        <div className="card w-full max-w-md">
          <div className="card-body">
            <h1 className="text-2xl font-bold text-center mb-6">Se connecter</h1>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-sawaka-800 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Votre email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-sawaka-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sawaka-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-sawaka-800 mb-1">
                  Mot de passe
                </label>
                <input
                  type="password"
                  placeholder="Votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-sawaka-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sawaka-500"
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full mt-4"
              >
                Se connecter
              </button>
            </form>

            <p className="text-center text-sm text-sawaka-700 mt-6">
              Pas encore de compte ?{" "}
              <a
                href="/signup"
                className="text-sawaka-600 hover:text-sawaka-800 font-semibold"
              >
                Créez-en un
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
