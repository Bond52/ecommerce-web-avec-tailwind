'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const API_URL =
    process.env.NEXT_PUBLIC_API_BASE ||
    (typeof window !== 'undefined' && window.location.hostname === 'localhost'
      ? 'http://localhost:5000'
      : 'https://sawaka-api.onrender.com');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Option A (cookie)
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.error || 'Identifiants incorrects');

      // facultatif : garder aussi le token côté front
      if (data.token) localStorage.setItem('auth_token', data.token);
      if (data.role) localStorage.setItem('role', data.role);

      if (data.role === 'admin') router.push('/admin');
      else if (data.role === 'vendeur') router.push('/vendor/articles');
      else router.push('/acheteur');
    } catch {
      alert('Erreur de connexion au serveur');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Se connecter</button>
    </form>
  );
}
