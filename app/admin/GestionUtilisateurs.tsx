"use client";
import { useEffect, useState } from "react";

export default function GestionUtilisateurs() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/users`, { credentials: "include" })
      .then(res => res.json())
      .then(setUsers)
      .catch(err => console.error(err));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cet utilisateur ?")) return;
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/users/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setUsers(users.filter((u: any) => u._id !== id));
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Liste des utilisateurs</h2>
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th>Nom</th><th>Email</th><th>Rôle</th><th>Vendeur</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u: any) => (
            <tr key={u._id} className="border-t">
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.isSeller ? "Oui" : "Non"}</td>
              <td>
                <button onClick={() => handleDelete(u._id)} className="text-red-500">🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
