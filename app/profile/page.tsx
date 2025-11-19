"use client";

import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";

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
    } else alert("Erreur lors de la mise à jour");
  };

  if (error) return <p className="text-center text-red-600 mt-6">{error}</p>;
  if (!user) return <p className="text-center text-gray-500 mt-6">Chargement...</p>;

  return (
    <div className="wrap py-12">

      {/* CARD PRINCIPALE */}
      <div className="bg-white border border-cream-200 shadow-md rounded-2xl p-10 max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold text-sawaka-800 text-center mb-10">
          Mon profil
        </h1>

        {/* GRID PRINCIPALE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* SECTION PHOTO */}
          <div className="md:col-span-1 flex flex-col items-center bg-cream-100 p-6 rounded-xl border border-cream-300">
            <img
              src="/images/profile-placeholder.png"
              className="w-40 h-40 object-cover rounded-lg border border-cream-300 shadow-sm"
              alt="profile"
            />
            <button className="mt-4 px-4 py-2 rounded-lg bg-sawaka-500 text-white hover:bg-sawaka-600">
              Changer la photo
            </button>
          </div>

          {/* SECTION CHAMPS IDENTITÉ */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* ======== CHAMP GÉNÉRIQUE RÉUTILISABLE ======== */}
            {Object.entries(user).map(([key, value]) => {
              if (["_id", "__v", "password", "createdAt"].includes(key)) return null;

              const isEditing = editingField === key;
              const isSelectProvince = key === "province";
              const isSelectCity = key === "city";
              const isCheckbox = key === "isSeller";
              const isCountry = key === "country";

              return (
                <div key={key} className="flex flex-col bg-cream-50 p-4 rounded-xl border border-cream-200 shadow-sm">

                  <label className="text-sm text-sawaka-600 mb-1 capitalize">
                    {key}
                  </label>

                  {/* Province */}
                  {isEditing && isSelectProvince ? (
                    <select
                      value={tempValue || ""}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="input"
                    >
                      <option>Choisir une province</option>
                      {Object.keys(provincesCM).map((prov) => (
                        <option key={prov}>{prov}</option>
                      ))}
                    </select>
                  ) : isSelectProvince ? (
                    <p className="font-medium">{user.province || "—"}</p>
                  ) : null}

                  {/* Ville */}
                  {isEditing && isSelectCity ? (
                    <select
                      value={tempValue || ""}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="input"
                    >
                      <option>Choisir une ville</option>
                      {user.province &&
                        provincesCM[user.province]?.map((city) => (
                          <option key={city}>{city}</option>
                        ))}
                    </select>
                  ) : isSelectCity ? (
                    <p className="font-medium">{user.city || "—"}</p>
                  ) : null}

                  {/* Country */}
                  {isEditing && isCountry ? (
                    <select
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="input"
                    >
                      <option>Cameroun</option>
                      <option>Canada</option>
                    </select>
                  ) : isCountry ? (
                    <p className="font-medium">{user.country}</p>
                  ) : null}

                  {/* Checkbox vendeur */}
                  {isCheckbox && (
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={user.isSeller}
                        onChange={() => handleSave("isSeller")}
                      />
                      <span className="font-medium">{user.isSeller ? "Vendeur" : "Acheteur"}</span>
                    </label>
                  )}

                  {/* Champs texte */}
                  {!isCheckbox &&
                    !isSelectProvince &&
                    !isSelectCity &&
                    !isCountry &&
                    !isEditing && (
                      <p className="font-medium">{String(value ?? "—")}</p>
                    )}

                  {isEditing &&
                    !isCheckbox &&
                    !isSelectProvince &&
                    !isSelectCity &&
                    !isCountry && (
                      <input
                        value={tempValue ?? ""}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="input"
                      />
                    )}

                  {/* Icône Edit */}
                  {!isCheckbox && (
                    <div className="flex justify-end mt-2">
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
                  )}

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
