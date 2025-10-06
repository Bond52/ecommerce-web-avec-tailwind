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
  "Adamaoua": ["Ngaoundéré", "Meiganga", "Tibati"]
};

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://ecommerce-web-avec-tailwind.onrender.com";

  // 🧭 Récupération du profil utilisateur
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/user/profile`, {
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 401) throw new Error("Session expirée");
          throw new Error("Erreur de chargement du profil");
        }
        return res.json();
      })
      .then((data) => setUser(data))
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }, [API_BASE_URL]);

  // 🧩 Sauvegarde d'un champ modifié
  const handleSave = async (field: string) => {
    const payload =
      field === "isSeller"
        ? { [field]: !user.isSeller }
        : { [field]: tempValue };

    const res = await fetch(`${API_BASE_URL}/api/user/profile`, {
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

  if (error) return <p className="text-center text-red-600 mt-6">{error}</p>;
  if (!user) return <p className="text-center text-gray-500 mt-6">Chargement...</p>;

  // 🧱 UI principale
  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Mon profil</h1>

      {Object.entries(user).map(([key, value]) => {
        if (["_id", "__v", "password"].includes(key)) return null;

        const isEditing = editingField === key;
        const isSelectProvince = key === "province";
        const isSelectCity = key === "city";
        const isCheckbox = key === "isSeller";
        const isCountry = key === "country";

        return (
          <div
            key={key}
            className="flex justify-between items-center border-b py-3 gap-4"
          >
            <div className="flex-1">
              <p className="text-sm text-gray-500">{key}</p>

              {/* Province */}
              {isEditing && isSelectProvince ? (
                <select
                  value={tempValue || ""}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="border p-1 rounded w-full"
                >
                  <option value="">Province</option>
                  {Object.keys(provincesCM).map((prov) => (
                    <option key={prov} value={prov}>
                      {prov}
                    </option>
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
                  className="border p-1 rounded w-full"
                >
                  <option value="">Ville</option>
                  {user.province &&
                    provincesCM[user.province]?.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                </select>
              ) : isSelectCity ? (
                <p className="font-medium">{user.city || "—"}</p>
              ) : null}

              {/* Checkbox isSeller */}
              {isCheckbox ? (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="checkbox"
                    checked={user.isSeller}
                    onChange={() => handleSave("isSeller")}
                    className="h-4 w-4"
                  />
                  <span>{user.isSeller ? "Vendeur" : "Acheteur"}</span>
                </div>
              ) : null}

              {/* Country */}
              {isEditing && isCountry ? (
                <select
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="border p-1 rounded w-full"
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
                  <p className="font-medium">{String(value ?? "—")}</p>
                )}

              {isEditing &&
                !isSelectProvince &&
                !isSelectCity &&
                !isCountry &&
                !isCheckbox && (
                  <input
                    className="border p-1 rounded w-full"
                    value={tempValue ?? ""}
                    onChange={(e) => setTempValue(e.target.value)}
                  />
                )}
            </div>

            {/* Boutons ✏️ ✅ */}
            {!isCheckbox && (
              <div className="flex items-center">
                {isEditing ? (
                  <button
                    className="text-green-600 font-semibold ml-2"
                    onClick={() => handleSave(key)}
                  >
                    ✅
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingField(key);
                      setTempValue(user[key]);
                    }}
                    className="text-blue-500"
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
  );
}
