"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Mini base de données Cameroun
const provincesCM = {
  "Centre": ["Yaoundé", "Mbalmayo", "Obala"],
  "Littoral": ["Douala", "Nkongsamba", "Yabassi"],
  "Ouest": ["Bafoussam", "Dschang", "Foumban"],
  "Nord": ["Garoua", "Guider", "Pitoa"],
  "Extrême-Nord": ["Maroua", "Kousséri", "Mora"],
  "Sud": ["Ebolowa", "Kribi", "Sangmélima"],
  "Est": ["Bertoua", "Batouri", "Abong-Mbang"],
  "Nord-Ouest": ["Bamenda", "Kumbo", "Ndop"],
  "Sud-Ouest": ["Buea", "Limbe", "Kumba"],
  "Adamaoua": ["Ngaoundéré", "Meiganga", "Tibati"]
};

export default function RegisterPage() {
  const router = useRouter();

  // ✔ tout le monde est vendeur
  const isSeller = true;

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    country: 'Cameroun',
    province: '',
    city: '',
    pickupPoint: '',
    password: '',
    commerceName: '',
    neighborhood: '',
    idCardImage: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "province" ? { city: "" } : {})
    }));
  };

  // -------------------------------------------------------------
  // 🚫 Nouveau comportement : inscription désactivée temporairement
  // -------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    alert("🚫 L'inscription n'est pas disponible pour le moment.");
    return;

    /*  
    ------------------------------------------------------------------
    🔒 CODE ORIGINAL D’INSCRIPTION — LAISSÉ EN PLACE MAIS EN COMMENTAIRE
    ------------------------------------------------------------------

    const API_URL =
      process.env.NEXT_PUBLIC_API_BASE ||
      (typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? 'http://localhost:5000'
        : 'https://ecommerce-web-avec-tailwind.onrender.com');

    const roles = "acheteur,vendeur";

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...form, isSeller, roles }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.error || 'Erreur à l’inscription');

      if (data.token) {
        localStorage.setItem(
          'user',
          JSON.stringify({
            token: data.token,
            roles: roles,
            username: form.username,
            firstName: form.firstName,
            lastName: form.lastName,
          })
        );
      }

      router.push('/');
    } catch (err) {
      console.error(err);
      alert('Erreur de connexion au serveur');
    }

    */
  };

  return (
    <main className="flex items-center justify-center min-h-[70vh] bg-cream-100">
      <div className="card w-full max-w-2xl">
        <div className="card-body">
          <h1 className="text-2xl font-bold text-center mb-6">Créer un compte</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input name="firstName" placeholder="Nom" value={form.firstName} onChange={handleChange} required className="input" />
              <input name="lastName" placeholder="Prénom" value={form.lastName} onChange={handleChange} required className="input" />
            </div>

            <input name="username" placeholder="Nom d’utilisateur" value={form.username} onChange={handleChange} required className="input w-full" />

            <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="input w-full" />

            <input type="tel" name="phone" placeholder="Téléphone" value={form.phone} onChange={handleChange} required className="input w-full" />

            {/* Pays / Province / Ville */}
            <div className="grid grid-cols-3 gap-2">
              <select name="country" value={form.country} onChange={handleChange} required className="input">
                <option value="Cameroun">Cameroun</option>
                <option value="Canada">Canada</option>
              </select>

              <select name="province" value={form.province} onChange={handleChange} required className="input">
                <option value="">Province</option>
                {Object.keys(provincesCM).map((prov) => (
                  <option key={prov} value={prov}>{prov}</option>
                ))}
              </select>

              <select name="city" value={form.city} onChange={handleChange} required className="input" disabled={!form.province}>
                <option value="">Ville</option>
                {form.province &&
                  provincesCM[form.province]?.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
              </select>
            </div>

            {form.city && (
              <select name="pickupPoint" value={form.pickupPoint} onChange={handleChange} className="input w-full">
                <option value="">Point de retrait</option>
                <option value="centre-ville">Centre-ville</option>
                <option value="gare">Gare</option>
                <option value="université">Université</option>
              </select>
            )}

            <input type="password" name="password" placeholder="Mot de passe" value={form.password} onChange={handleChange} required className="input w-full" />

            {/* Champs optionnels vendeur */}
            <div className="space-y-3 border-t pt-4">
              <input name="commerceName" placeholder="Nom du commerce (optionnel)" value={form.commerceName} onChange={handleChange} className="input w-full" />
              <textarea name="neighborhood" placeholder="Quartier / Description (optionnel)" value={form.neighborhood} onChange={handleChange} className="input w-full" />
              <input name="idCardImage" placeholder="Lien vers carte d’identité (URL) (optionnel)" value={form.idCardImage} onChange={handleChange} className="input w-full" />
            </div>

            <button type="submit" className="btn-primary w-full mt-4">
              S’inscrire
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
