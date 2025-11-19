"use client";

import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";

// --- Mini base CM pour provinces
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
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const API_URL =
    process.env.NEXT_PUBLIC_API_BASE ||
    (typeof window !== "undefined" && window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://ecommerce-web-avec-tailwind.onrender.com");

  // --- Charger le profil
  useEffect(() => {
    fetch(`${API_URL}/api/user/profile`, { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 401) throw new Error("Session expirée");
          throw new Error("Erreur de chargement du profil");
        }
        return res.json();
      })
      .then(setUser)
      .catch((err) => setError(err.message));
  }, [API_URL]);

  // --- Sauvegarder modifications
  const handleSave = async (field: string) => {
    const payload =
      field === "isSeller"
        ? { [field]: !user.isSeller }
        : { [field]: tempValue };

    const res = await fetch(`${API_URL}/api/user/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });

    if (res.ok) {
      const updated = await res.json();
      setUser(updated);
      setEditingField(null);
    } else {
      alert("Erreur lors de la mise à jour");
    }
  };

  // --- Fonction utilitaire pour afficher + éditer un champ
  function renderInput(key: string, value: any) {
    const isEditing = editingField === key;

    return (
      <div key={key} className="flex flex-col">
        <label className="text-sm text-sawaka-600 mb-1 capitalize">
          {key}
        </label>

        {isEditing ? (
          <input
            className="border border-gray-300 rounded-lg p-3"
            value={tempValue ?? ""}
            onChange={(e) => setTempValue(e.target.value)}
          />
        ) : (
          <input
            className="border border-gray-300 rounded-lg p-3 bg-gray-50"
            readOnly
            value={value ?? ""}
          />
        )}

        <div className="flex justify-end mt-1">
          {isEditing ? (
            <button
              onClick={() => handleSave(key)}
              className="text-green-600 font-semibold"
            >
              ✔ Enregistrer
            </button>
          ) : (
            <button
              onClick={() => {
                setEditingField(key);
                setTempValue(value);
              }}
              className="text-sawaka-700 hover:text-sawaka-900"
            >
              <Pencil size={18} />
            </button>
          )}
        </div>
      </div>
    );
  }

  if (error) return <p className="text-center text-red-600 mt-6">{error}</p>;
  if (!user) return <p className="text-center text-gray-500 mt-6">Chargement...</p>;

  return (
    <div className="wrap py-12">

      <div className="bg-white border border-cream-200 shadow-md rounded-2xl p-10 max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold text-sawaka-800 mb-10">
          Mon profil
        </h1>

        {/* GRID PRINCIPALE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* --- PHOTO + UPLOAD --- */}
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

          {/* --- SECTIONS FORM --- */}
          <div className="col-span-2 space-y-10">

            {/* INFORMATIONS PROFIL */}
            <div>
              <h2 className="text-xl font-semibold text-sawaka-800 mb-4">
                Informations du profil
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {renderInput("username", user.username)}
                {renderInput("firstName", user.firstName)}
                {renderInput("lastName", user.lastName)}
                {renderInput("nickname", user.nickname)}
                {renderInput("roles", user.roles)}
              </div>
            </div>

            {/* CONTACT */}
            <div>
              <h2 className="text-xl font-semibold text-sawaka-800 mb-4">
                Informations de contact
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {renderInput("email", user.email)}
                {renderInput("phone", user.phone)}
                {renderInput("country", user.country)}
                {renderInput("province", user.province)}
                {renderInput("city", user.city)}
                {renderInput("pickupPoint", user.pickupPoint)}
              </div>
            </div>

            {/* VENDEUR */}
            {user.isSeller && (
              <div>
                <h2 className="text-xl font-semibold text-sawaka-800 mb-4">
                  Informations vendeur
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {renderInput("commerceName", user.commerceName)}
                  {renderInput("neighborhood", user.neighborhood)}
                  {renderInput("idCardImage", user.idCardImage)}
                </div>

                <label className="inline-flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    checked={user.isSeller}
                    onChange={() => handleSave("isSeller")}
                  />
                  <span className="font-medium">Compte vendeur activé</span>
                </label>
              </div>
            )}

            {/* ABOUT */}
            <div>
              <h2 className="text-xl font-semibold text-sawaka-800 mb-4">
                À propos
              </h2>
              {editingField === "about" ? (
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 h-32"
                  value={tempValue ?? ""}
                  onChange={(e) => setTempValue(e.target.value)}
                />
              ) : (
                <p className="bg-white border border-gray-300 rounded-lg p-3 text-sawaka-800 min-h-[100px]">
                  {user.about || "—"}
                </p>
              )}

              <div className="flex justify-end mt-2">
                {editingField === "about" ? (
                  <button
                    onClick={() => handleSave("about")}
                    className="text-green-600 font-semibold"
                  >
                    ✔ Enregistrer
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingField("about");
                      setTempValue(user.about || "");
                    }}
                    className="text-sawaka-700 hover:text-sawaka-900"
                  >
                    <Pencil size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* MOT DE PASSE */}
            <div>
              <h2 className="text-xl font-semibold text-sawaka-800 mb-4">
                Mot de passe
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input
                  type="password"
                  placeholder="Ancien mot de passe"
                  className="border border-gray-300 rounded-lg p-3"
                />
                <input
                  type="password"
                  placeholder="Nouveau mot de passe"
                  className="border border-gray-300 rounded-lg p-3"
                />
              </div>

              <button className="mt-4 px-4 py-2 bg-sawaka-600 text-white rounded-lg hover:bg-sawaka-700">
                Modifier le mot de passe
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
