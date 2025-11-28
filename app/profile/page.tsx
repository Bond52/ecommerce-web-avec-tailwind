"use client";

import { useState, useEffect } from "react";

const provincesCM: Record<string, string[]> = {
  Centre: ["Yaoundé", "Mbalmayo", "Obala"],
  Littoral: ["Douala", "Nkongsamba", "Yabassi"],
  Ouest: ["Bafoussam", "Dschang", "Foumban"],
  Nord: ["Garoua", "Guider", "Pitoa"],
  "Extrême-Nord": ["Maroua", "Kousséri", "Mora"],
  Sud: ["Ebolowa", "Kribi", "Sangmélima"],
  Est: ["Bertoua", "Batouri", "Abong-Mbang"],
  "Nord-Ouest": ["Bamenda", "Kumbo", "Ndop"],
  "Sud-Ouest": ["Buea", "Limbe", "Kumba"],
  Adamaoua: ["Ngaoundéré", "Meiganga", "Tibati"],
};

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const API_URL =
    process.env.NEXT_PUBLIC_API_BASE ||
    (typeof window !== "undefined" &&
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://ecommerce-web-avec-tailwind.onrender.com");

  useEffect(() => {
    fetch(`${API_URL}/api/user/profile`, { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) throw new Error("Erreur de chargement");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setForm(data);
      })
      .catch((err) => setError(err.message));
  }, [API_URL]);

  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!user || !form) return <p className="text-center">Chargement...</p>;

  const isModified = JSON.stringify(user) !== JSON.stringify(form);

  const updateField = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

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
      <h1 className="text-3xl font-bold text-sawaka-800 mb-6">Mon profil</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* COLONNE GAUCHE */}
        <div className="space-y-6">
          {/* PHOTO */}
          <div className="bg-white rounded-xl shadow border p-6 text-center">
            <div className="w-40 h-40 rounded-full bg-sawaka-400 flex items-center justify-center text-4xl text-white font-bold mx-auto">
              {form.firstName?.[0]}{form.lastName?.[0]}
            </div>

            <h2 className="text-xl font-semibold mt-4">
              {form.firstName} {form.lastName}
            </h2>
            <p className="text-gray-600">@{form.username}</p>

            <button className="mt-4 px-4 py-2 bg-sawaka-600 text-white rounded-lg">
              Changer la photo
            </button>
          </div>

          {/* RÔLES + ABOUT */}
          <div className="bg-white rounded-xl shadow border p-6">
            <h3 className="font-semibold text-sawaka-800 mb-4">Rôles</h3>
            <input
              value={form.roles}
              onChange={(e) => updateField("roles", e.target.value)}
              className="w-full border rounded-lg p-2 mb-4"
            />
            <h3 className="font-semibold text-sawaka-800 mb-2">À propos de moi</h3>
            <textarea
              value={form.about}
              onChange={(e) => updateField("about", e.target.value)}
              className="w-full border rounded-lg p-3 h-28"
            />
          </div>

          {/* MOT DE PASSE */}
          <div className="bg-white rounded-xl shadow border p-6">
            <h3 className="font-semibold text-sawaka-800 mb-4">Sécurité</h3>

            <input
              type="password"
              placeholder="Ancien mot de passe"
              className="w-full border rounded-lg p-2 mb-3"
            />
            <input
              type="password"
              placeholder="Nouveau mot de passe"
              className="w-full border rounded-lg p-2"
            />

            <button className="mt-4 w-full px-4 py-2 bg-sawaka-600 text-white rounded-lg">
              Modifier le mot de passe
            </button>
          </div>
        </div>

        {/* COLONNE DROITE */}
        <div className="lg:col-span-2 space-y-6">

          {/* INFO PERSONNELLES */}
          <Card title="Informations personnelles">
            <Grid>
              <Input label="Nom d'utilisateur" value={form.username} onChange={(e) => updateField("username", e.target.value)} />
              <Input label="Surnom / Nom affiché" value={form.nickname} onChange={(e) => updateField("nickname", e.target.value)} />
              <Input label="Prénom" value={form.firstName} onChange={(e) => updateField("firstName", e.target.value)} />
              <Input label="Nom" value={form.lastName} onChange={(e) => updateField("lastName", e.target.value)} />
            </Grid>
          </Card>

          {/* COORDONNÉES */}
          <Card title="Coordonnées">
            <Grid>
              <Input label="Email" value={form.email} onChange={(e) => updateField("email", e.target.value)} />
              <Input label="Téléphone" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} />
              <Input label="Pays" value={form.country} onChange={(e) => updateField("country", e.target.value)} />

              <Select label="Province" value={form.province} onChange={(e) => updateField("province", e.target.value)} options={Object.keys(provincesCM)} />

              <Select label="Ville" value={form.city} onChange={(e) => updateField("city", e.target.value)} options={form.province ? provincesCM[form.province] : []} />

              <Input label="Point de retrait" value={form.pickupPoint} onChange={(e) => updateField("pickupPoint", e.target.value)} />
            </Grid>
          </Card>

          {/* VENDEUR */}
          {form.isSeller && (
            <Card title="Espace Vendeur">
              <Grid>
                <Input label="Nom du commerce" value={form.commerceName} onChange={(e) => updateField("commerceName", e.target.value)} />
                <Input label="Quartier" value={form.neighborhood} onChange={(e) => updateField("neighborhood", e.target.value)} />
                <Input label="Pièce d'identité (lien)" value={form.idCardImage} onChange={(e) => updateField("idCardImage", e.target.value)} />
              </Grid>
            </Card>
          )}

          {/* BOUTON SAUVEGARDE */}
          <div className="text-center">
            <button
              disabled={!isModified || saving}
              onClick={handleSave}
              className={`
                px-6 py-3 rounded-lg font-semibold
                ${!isModified || saving
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-sawaka-700 text-white hover:bg-sawaka-800"}
              `}
            >
              {saving ? "Enregistrement..." : "Mettre à jour le profil"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* COMPONENTS */
function Card({ title, children }: any) {
  return (
    <div className="bg-white rounded-xl shadow border p-6">
      <h3 className="text-xl font-semibold text-sawaka-800 mb-4">{title}</h3>
      {children}
    </div>
  );
}

function Grid({ children }: any) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">{children}</div>;
}

function Input({ label, value, onChange }: any) {
  return (
    <div className="flex flex-col">
      <label className="text-sawaka-700 mb-1">{label}</label>
      <input value={value} onChange={onChange} className="border rounded-lg p-2" />
    </div>
  );
}

function Select({ label, value, onChange, options }: any) {
  return (
    <div className="flex flex-col">
      <label className="text-sawaka-700 mb-1">{label}</label>
      <select value={value || ""} onChange={onChange} className="border rounded-lg p-2">
        <option value="">Sélectionner…</option>
        {options.map((opt: string) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
