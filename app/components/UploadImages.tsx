"use client";

import { useState } from "react";

export default function UploadImages({ onUploadComplete }: { onUploadComplete: (urls: string[]) => void }) {
  const [files, setFiles] = useState<FileList | null>(null);
  const [preview, setPreview] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "http://localhost:5000";

  // 🖼️ Prévisualisation locale avant upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (selected) {
      setFiles(selected);
      const previews = Array.from(selected).map((f) => URL.createObjectURL(f));
      setPreview(previews);
    }
  };

  // 📤 Upload Cloudinary
  const handleUpload = async () => {
    if (!files || files.length === 0) return alert("Choisissez au moins une image !");
    setUploading(true);

    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append("images", f));

    try {
      const res = await fetch(`${API_BASE}/api/seller/upload`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Erreur lors de l’upload");

      const data = await res.json();
      onUploadComplete(data.urls); // renvoie les URLs au parent
      alert("✅ Upload réussi !");
      setFiles(null);
      setPreview([]);
      setProgress(100);
    } catch (err) {
      console.error(err);
      alert("❌ Erreur upload Cloudinary");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-3">📸 Ajouter des images</h3>

      {/* Sélecteur d'images */}
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full border p-2 rounded mb-3"
      />

      {/* Prévisualisation */}
      {preview.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-3">
          {preview.map((src, i) => (
            <div key={i} className="relative">
              <img
                src={src}
                alt={`Preview ${i}`}
                className="w-full h-32 object-cover rounded-lg border"
              />
            </div>
          ))}
        </div>
      )}

      {/* Barre de progression */}
      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
          <div
            className="bg-sawaka-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Bouton upload */}
      <button
        onClick={handleUpload}
        disabled={uploading}
        className={`px-4 py-2 rounded text-white ${uploading ? "bg-gray-400" : "bg-sawaka-600 hover:bg-sawaka-700"}`}
      >
        {uploading ? "⏳ Upload en cours..." : "⬆️ Envoyer sur Cloudinary"}
      </button>
    </div>
  );
}
