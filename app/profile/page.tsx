
"use client";
import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");

  useEffect(() => {
    fetch("/api/user/profile", { credentials: "include" })
      .then((res) => res.json())
      .then(setUser);
  }, []);

  const handleEdit = (field: string) => {
    setEditingField(field);
    setTempValue(user[field]);
  };

  const handleSave = async (field: string) => {
    const updated = { ...user, [field]: tempValue };
    const res = await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: tempValue }),
      credentials: "include",
    });
    if (res.ok) {
      setUser(updated);
      setEditingField(null);
    }
  };

  if (!user) return <p>Chargement...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Mon profil</h1>

      {Object.entries(user).map(([key, value]) => (
        key !== "_id" && key !== "__v" && (
          <div
            key={key}
            className="flex justify-between items-center border-b py-3"
          >
            <div>
              <p className="text-sm text-gray-500">{key}</p>
              {editingField === key ? (
                <input
                  className="border p-1 rounded w-full"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                />
              ) : (
              <p className="font-medium">{String(value ?? "—")}</p>
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
              <button onClick={() => handleEdit(key)} className="text-blue-500">
                <Pencil size={18} />
              </button>
            )}
          </div>
        )
      ))}
    </div>
  );
}
