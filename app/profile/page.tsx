"use client";

import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";

// 📍 Mini base de données Cameroun
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

  // API URL identique
  const API_URL =
    process.env.NEXT_PUBLIC_API_BASE ||
    (typeof window !== "undefined" && window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://ecommerce-web-avec-tailwind.onrender.com");

  // Récupération du profil utilisateur
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

  // Sauvegarde
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
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-2xl border border-cream-200 p-8">
        
        <h1 className="text-3xl font-bold text-sawaka-800 text-center mb-8">
          Mon profil
        </h1>

        {/* LISTE DES CHAMPS */}
        <div className="flex flex-col divide-y divide-cream-200">

          {Object.entries(user).map(([key, value]) => {
            if (["_id", "__v", "password"].includes(key)) return null;

            const isEditing = editingField === key;
            const isSelectProvince = key === "province";
            const isSelectCity = key === "city";
            const isCheckbox = key === "isSeller";
            const isCountry = key === "country";

            return (
              <div key={key} className="py-4 flex justify-between items-start gap-4">
                
                {/* LABEL + VALUE */}
                <div className="flex-1">

                  <p className="text-sm text-sawaka-600 mb-1 capitalize">
                    {key}
                  </p>

                  {/* Province */}
                  {isEditing && isSelectProvince ? (
                    <select
                      value={tempValue || ""}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="border border-sawaka-300 rounded-lg p-2 w-full"
                    >
                      <option>Choisir une province</option>
                      {Object.keys(provincesCM).map((prov) => (
                        <option key={prov}>{prov}</option>
                      ))}
                    </select>
                  ) : isSelectProvince ? (
                    <p className="font-medium">{user.province || "—"}</p>
                  ) : null}

                  {/* City */}
                  {isEditing && isSelectCity ? (
                    <select
                      value={tempValue || ""}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="border border-sawaka-300 rounded-lg p-2 w-full"
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

                  {/* isSeller */}
                  {isCheckbox && (
                    <label className="flex items-center gap-2 mt-1">
                      <input
                        type="checkbox"
                        checked={user.isSeller}
                        onChange={() => handleSave("isSeller")}
                        className="h-4 w-4"
                      />
                      <span className="font-medium">
                        {user.isSeller ? "Vendeur" : "Acheteur"}
                      </span>
                    </label>
                  )}

                  {/* Country */}
                  {isEditing && isCountry ? (
                    <select
                      className="border border-sawaka-300 rounded-lg p-2 w-full"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                    >
                      <option value="Cameroun">Cameroun</option>
                      <option value="Canada">Canada</option>
                    </select>
                  ) : isCountry ? (
                    <p className="font-medium">{user.country}</p>
                  ) : null}

                  {/* Autres champs */}
                  {!isCheckbox &&
                    !isSelectProvince &&
                    !isSelectCity &&
                    !isCountry &&
                    !isEditing && (
                      <p className="font-medium break-all">
                        {String(value ?? "—")}
                      </p>
                    )}

                  {isEditing &&
                    !isCheckbox &&
                    !isSelectProvince &&
                    !isSelectCity &&
                    !isCountry && (
                      <input
                        className="border border-sawaka-300 rounded-lg p-2 w-full"
                        value={tempValue ?? ""}
                        onChange={(e) => setTempValue(e.target.value)}
                      />
                    )}
                </div>

                {/* Boutons */}
                {!isCheckbox && (
                  <div>
                    {isEditing ? (
                      <button
                        onClick={() => handleSave(key)}
                        className="text-green-600 text-lg"
                      >
                        ✔
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingField(key);
                          setTempValue(user[key]);
                        }}
                        className="text-sawaka-600 hover:text-sawaka-800"
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
  );
}
