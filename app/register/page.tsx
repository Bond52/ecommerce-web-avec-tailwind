'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  const [isSeller, setIsSeller] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    country: '',
    province: '',
    city: '',
    pickupPoint: '',
    password: '',
    commerceName: '',
    neighborhood: '',
    idCardImage: '',
  });

  const API_URL =
    process.env.NEXT_PUBLIC_API_BASE ||
    (typeof window !== 'undefined' && window.location.hostname === 'localhost'
      ? 'http://localhost:5000'
      : 'https://ecommerce-web-avec-tailwind.onrender.com');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...form, isSeller }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.error || 'Erreur à l’inscription');

      // 🔑 Sauvegarde user complet
      if (data.token) {
        localStorage.setItem(
          'user',
          JSON.stringify({
            token: data.token,
            roles: data.roles,
            username: data.username || form.username,
            firstName: data.firstName || form.firstName,
            lastName: data.lastName || form.lastName,
          })
        );
      }

      alert('Compte créé avec succès !');
      router.push('/'); // 🔥 retour accueil directement
    } catch (err) {
      console.error(err);
      alert('Erreur de connexion au serveur');
    }
  };

  return (
    <main className="flex items-center justify-center min-h-[70vh] bg-cream-100">
      <div className="card w-full max-w-2xl">
        <div className="card-body">
          <h1 className="text-2xl font-bold text-center mb-6">Créer un compte</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                name="firstName"
                placeholder="Nom"
                value={form.firstName}
                onChange={handleChange}
                required
                className="input"
              />
              <input
                name="lastName"
                placeholder="Prénom"
                value={form.lastName}
                onChange={handleChange}
                required
                className="input"
              />
            </div>

            <input
              name="username"
              placeholder="Nom d’utilisateur"
              value={form.username}
              onChange={handleChange}
              required
              className="input w-full"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="input w-full"
            />

            <input
              type="tel"
              name="phone"
              placeholder="Téléphone"
              value={form.phone}
              onChange={handleChange}
              required
              className="input w-full"
            />

            <div className="grid grid-cols-3 gap-2">
              <select
                name="country"
                value={form.country}
                onChange={handleChange}
                required
                className="input"
              >
                <option value="">Pays</option>
                <option value="Canada">Canada</option>
                <option value="Cameroun">Cameroun</option>
              </select>

              <select
                name="province"
                value={form.province}
                onChange={handleChange}
                required
                className="input"
              >
                <option value="">Province</option>
              </select>

              <select
                name="city"
                value={form.city}
                onChange={handleChange}
                required
                className="input"
              >
                <option value="">Ville</option>
              </select>
            </div>

            {form.city && (
              <select
                name="pickupPoint"
                value={form.pickupPoint}
                onChange={handleChange}
                className="input w-full"
              >
                <option value="">Point de retrait</option>
                <option value="centre-ville">Centre-ville</option>
                <option value="gare">Gare</option>
                <option value="université">Université</option>
              </select>
            )}

            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              value={form.password}
              onChange={handleChange}
              required
              className="input w-full"
            />

            {/* Case vendeur */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isSeller}
                onChange={() => setIsSeller(!isSeller)}
              />
              Je suis vendeur
            </label>

            {isSeller && (
              <div className="space-y-3 border-t pt-4">
                <input
                  name="commerceName"
                  placeholder="Nom du commerce"
                  value={form.commerceName}
                  onChange={handleChange}
                  className="input w-full"
                />
                <textarea
                  name="neighborhood"
                  placeholder="Quartier / Description"
                  value={form.neighborhood}
                  onChange={handleChange}
                  className="input w-full"
                />
                <input
                  name="idCardImage"
                  placeholder="Lien vers carte d’identité (URL)"
                  value={form.idCardImage}
                  onChange={handleChange}
                  className="input w-full"
                />
              </div>
            )}

            <button type="submit" className="btn-primary w-full mt-4">
              S’inscrire
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
