"use client";
import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  // 🧭 URL dynamique du backend
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://ecommerce-web-avec-tailwind.onrender.com";

  // 🔄 Chargement du profil utilisateur
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/user/profile`, {
          credentials: "include", // indispensable pour envoyer le cookie JWT
        });

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            setError("Session expirée. Veuillez vous reconnecter.");
          } else {
            setError(`Erreur serveur (${res.status})`);
          }
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch (err: any) {
        console.error("❌ Erreur de connexion au profil :", err);
        setError("Impossible de joindre le serveur.");
      }
    };

    fetchProfile();
  }, [API_BASE_URL]);

  // ✏️ Mode édition champ par champ
  const handleEdit = (field: string) => {
    setEditingField(field);
    setTempValue(user[field]);
  };

  // 💾 Sauvegarde d’un champ modifié
  const handleSave = async (field: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: tempValue }),
        credentials: "include",
      });

      if (!res.ok) {
        alert("Erreur lors de la mise à jour.");
        return;
      }

      const updated = await res.json();
      setUser(updated);
      setEditingField(null);
    } catch (err) {
      console.error("Erreur update profil :", err);
      alert("Erreur de réseau.");
    }
  };

  // 🧾 Gestion des états
  if (error) {
    return (
      <div className="text-center mt-10 text-red-600 font-medium">{error}</div>
    );
  }

  if (!user) {
    return <p className="text-center mt-10 text-gray-500">Chargement...</p>;
  }

  // 🧍 Affichage du profil
  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Mon profil</h1>

      {Object.entries(user).map(
        ([key, value]) =>
          key !== "_id" &&
          key !== "__v" &&
          key !== "password" && (
            <div
              key={key}
              className="flex justify-between items-center border-b py-3"
            >
              <div className="flex-1">
                <p className="text-sm text-gray-500">{key}</p>
                {editingField === key ? (
                  <input
                    className="border p-1 rounded w-full"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                  />
                ) : (
                  <p className="font-medium break-all">
                    {String(value ?? "—")}
                  </p>
                )}
              </div>

              {editingField === key ? (
                <button
                  className="text-green-600 font-semibold ml-4"
                  onClick={() => handleSave(key)}
                >
                  ✅
                </button>
              ) : (
                <button
                  onClick={() => handleEdit(key)}
                  className="text-blue-500 ml-3"
                >
                  <Pencil size={18} />
                </button>
              )}
            </div>
          )
      )}
    </div>
  );
}
