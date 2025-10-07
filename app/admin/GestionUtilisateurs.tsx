"use client";
import { useEffect, useState } from "react";

type User = {
  _id: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role?: string;
  roles?: string[];
  isSeller?: boolean;
};

export default function GestionUtilisateurs() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://ecommerce-web-avec-tailwind.onrender.com";

  // 🔍 Charger les utilisateurs
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
          credentials: "include", // ✅ indispensable pour envoyer le cookie JWT
        });

        if (!res.ok) {
          const txt = await res.text();
          console.error("❌ Erreur backend :", txt);
          throw new Error(`Erreur serveur (${res.status})`);
        }

        const data = await res.json();
        console.log("✅ Utilisateurs chargés :", data);
        setUsers(data);
      } catch (err: any) {
        console.error("⚠️ Erreur fetch utilisateurs :", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [API_BASE_URL]);

  // 🗑 Suppression utilisateur
  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cet utilisateur ?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Erreur lors de la suppression");

      setUsers((prev) => prev.filter((u) => u._id !== id));
      alert("Utilisateur supprimé ✅");
    } catch (err) {
      console.error(err);
      alert("❌ Échec de la suppression");
    }
  };

  // 🧱 Interface
  if (loading) return <p className="text-center mt-4">Chargement...</p>;
  if (error)
    return (
      <p className="text-center text-red-600 mt-4">
        Erreur : {error}. Vérifie que tu es connecté en admin.
      </p>
    );

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-3">Liste des utilisateurs</h2>

      {users.length === 0 ? (
        <p className="text-gray-500 text-center">Aucun utilisateur trouvé.</p>
      ) : (
        <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="p-2">Nom</th>
              <th className="p-2">Email</th>
              <th className="p-2">Rôles</th>
              <th className="p-2">Vendeur</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t hover:bg-cream-50">
                <td className="p-2">
                  {u.firstName || u.lastName
                    ? `${u.firstName || ""} ${u.lastName || ""}`
                    : u.username || "—"}
                </td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">
                  {u.roles ? u.roles.join(", ") : u.role || "—"}
                </td>
                <td className="p-2">{u.isSeller ? "✅ Oui" : "❌ Non"}</td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => handleDelete(u._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    🗑 Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
