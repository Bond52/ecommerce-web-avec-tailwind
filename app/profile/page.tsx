"use client";

import { useState, useEffect } from "react";

// Mini base du Cameroun
const provincesCM: Record<string, string[]> = {
  "Centre": ["Yaoundé", "Mbalmayo", "Obala"],
  "Littoral": ["Douala", "Nkongsamba", "Yabassi"],
  "Ouest": ["Bafoussam", "Dschang", "Foumban"],
  "Nord": ["Garoua", "Guider", "Pitoa"],
  "Extrême-Nord": ["Maroua", "Kousséri", "Mora"],
  "Sud": ["Ebolowa", "Kribi", "Sangmélima"],
  "Est": ["Bertoua", "Batouri", "Abong-Mbang"],
  "Nord-Ouest": ["Bamenda", "Kumbo", "Ndop"],
  "Sud-Ouest": ["Buea", "Limbe", "Kumba"],
  "Adamaoua": ["Ngaoundéré", "Meiganga", "Tibati"],
};

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const API_URL =
    process.env.NEXT_PUBLIC_API_BASE ||
    (typeof window !== "undefined" && window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://ecommerce-web-avec-tailwind.onrender.com");

  // Charger profil
  useEffect(() => {
    fetch(`${API_URL}/api/user/profile`, { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) throw new Error("Erreur de chargement");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setForm(data); // copie initiale
      })
      .catch((err) => setError(err.message));
  }, [API_URL]);

  if (error)
    return <p className="text-center text-red-600 mt-6">{error}</p>;

  if (!user || !form)
    return <p className="text-center text-gray-500 mt-6">Chargement...</p>;

  // Vérifier si formulaire modifié
  const isModified = JSON.stringify(user) !== JSON.stringify(form);

  // Modifier champ
  const updateField = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  // On envoie tout d’un coup
  const handleSave = async () => {
    setSaving(true);

    const res = await fetch(`${API_URL}/api/user/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
      credentials: "include",
    });

    setSaving(false);

    if (res.ok) {
      const updated = await res.json();
      setUser(updated);
      setForm(updated);
      alert("Profil mis à jour !");
    } else {
      alert("Erreur lors de la mise à jour");
    }
  };

  return (
    <div className="wrap py-12">
      <div className="bg-white border border-cream-200 shadow-md rounded-2xl p-10 max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold text-sawaka-800 mb-10">
          Mon profil
        </h1>

        {/* GRID PRINCIPALE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* PHOTO */}
          <div className="col-span-1">
            <div className="bg-cream-100 border border-cream-300 rounded-xl p-6 flex flex-col items-center">
              <img
                src="/images/profile-placeholder.png"
                alt="photo"
                className="w-48 h-48 rounded-lg object-cover border border-cream-300 shadow-sm"
              />
              <button className="mt-4 px-4 py-2 bg-sawaka-600 text-white rounded-lg hover:bg-sawaka-700">
                Changer la photo
              </button>
            </div>
          </div>

          {/* FORM */}
          <div className="col-span-2 space-y-10">

            {/* --- INFORMATIONS PROFIL --- */}
            <Section title="Informations du profil">
              <Grid>
                <Input label="username" value={form.username}
                       onChange={(e) => updateField("username", e.target.value)} />
                <Input label="firstName" value={form.firstName}
                       onChange={(e) => updateField("firstName", e.target.value)} />
                <Input label="lastName" value={form.lastName}
                       onChange={(e) => updateField("lastName", e.target.value)} />
                <Input label="nickname" value={form.nickname}
                       onChange={(e) => updateField("nickname", e.target.value)} />
                <Input label="roles" value={form.roles}
                       onChange={(e) => updateField("roles", e.target.value)} />
              </Grid>
            </Section>

            {/* --- CONTACT --- */}
            <Section title="Informations de contact">
              <Grid>
                <Input label="email" value={form.email}
                       onChange={(e) => updateField("email", e.target.value)} />
                <Input label="phone" value={form.phone}
                       onChange={(e) => updateField("phone", e.target.value)} />
                <Input label="country" value={form.country}
                       onChange={(e) => updateField("country", e.target.value)} />
                <Select
                  label="province"
                  value={form.province}
                  onChange={(e) => updateField("province", e.target.value)}
                  options={Object.keys(provincesCM)}
                />
                <Select
                  label="city"
                  value={form.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  options={form.province ? provincesCM[form.province] : []}
                />
                <Input label="pickupPoint" value={form.pickupPoint}
                       onChange={(e) => updateField("pickupPoint", e.target.value)} />
              </Grid>
            </Section>

            {/* --- VENDEUR --- */}
            {form.isSeller && (
              <Section title="Informations vendeur">
                <Grid>
                  <Input label="commerceName" value={form.commerceName}
                         onChange={(e) => updateField("commerceName", e.target.value)} />
                  <Input label="neighborhood" value={form.neighborhood}
                         onChange={(e) => updateField("neighborhood", e.target.value)} />
                  <Input label="idCardImage" value={form.idCardImage}
                         onChange={(e) => updateField("idCardImage", e.target.value)} />
                </Grid>

                <label className="inline-flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    checked={form.isSeller}
                    onChange={(e) => updateField("isSeller", e.target.checked)}
                  />
                  <span className="font-medium">Compte vendeur activé</span>
                </label>
              </Section>
            )}

            {/* --- ABOUT --- */}
            <Section title="À propos">
              <textarea
                value={form.about || ""}
                onChange={(e) => updateField("about", e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 h-32"
              />
            </Section>

            {/* --- PASSWORD --- */}
            <Section title="Mot de passe">
              <Grid>
                <Input placeholder="Ancien mot de passe" />
                <Input placeholder="Nouveau mot de passe" />
              </Grid>

              <button className="mt-4 px-4 py-2 bg-sawaka-600 text-white rounded-lg hover:bg-sawaka-700">
                Modifier le mot de passe
              </button>
            </Section>

          </div>
        </div>

        {/* --- BOUTON SAVE GLOBAL --- */}
        <div className="mt-10 text-center">
          <button
            disabled={!isModified || saving}
            onClick={handleSave}
            className={`
              px-6 py-3 rounded-lg font-semibold
              ${!isModified || saving
                ? "bg-gray-300 cursor-not-allowed text-gray-600"
                : "bg-sawaka-700 text-white hover:bg-sawaka-800"}
            `}
          >
            {saving ? "Enregistrement..." : "Mettre à jour"}
          </button>
        </div>

      </div>
    </div>
  );
}

/* --- COMPOSANTS UTILITAIRES --- */

function Section({ title, children }: any) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-sawaka-800 mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Grid({ children }: any) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">{children}</div>;
}

function Input({ label, value, onChange, placeholder }: any) {
  return (
    <div className="flex flex-col">
      {label && (
        <label className="text-sm text-sawaka-600 mb-1 capitalize">
          {label}
        </label>
      )}
      <input
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="border border-gray-300 rounded-lg p-3 bg-white"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }: any) {
  return (
    <div className="flex flex-col">
      <label className="text-sm text-sawaka-600 mb-1 capitalize">{label}</label>
      <select
        value={value || ""}
        onChange={onChange}
        className="border border-gray-300 rounded-lg p-3 bg-white"
      >
        <option value="">Sélectionner...</option>
        {options.map((opt: string) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
