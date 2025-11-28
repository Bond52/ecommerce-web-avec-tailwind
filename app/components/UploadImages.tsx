"use client";

import { useState, useCallback } from "react";

export default function UploadImages({
  existingImages = [],
  onRemoveExisting,
  onUploadComplete,
}: {
  existingImages?: string[];
  onRemoveExisting?: (url: string) => void;
  onUploadComplete: (urls: string[]) => void;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const API_BASE =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_BASE ||
    "https://ecommerce-web-avec-tailwind.onrender.com";

  /** =========================================================
   *  🔥 Aucune réinitialisation du parent !
   *  Le composant ne modifie plus rien concernant editingId.
   ============================================================ */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files ? Array.from(e.target.files) : [];
      if (!selected.length) return;

      setFiles((prev) => [...prev, ...selected]);
      setPreview((prev) => [
        ...prev,
        ...selected.map((f) => URL.createObjectURL(f)),
      ]);
    },
    []
  );

  const handleUpload = useCallback(async () => {
    if (!files.length) return;

    setUploading(true);

    const formData = new FormData();
    files.forEach((f) => formData.append("images", f));

    const res = await fetch(`${API_BASE}/api/seller/upload`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data = await res.json();

    // ❗ Sécurité : si le backend ne renvoie pas d’URL → ne rien appliquer
    if (data?.urls?.length) {
      onUploadComplete([...data.urls]);
    }

    // On garde juste la partie locale ici
    setFiles([]);
    setPreview([]);
    setUploading(false);
  }, [files, API_BASE, onUploadComplete]);

  return (
    <div className="border border-cream-200 bg-cream-50 rounded-2xl p-8">

      {/* ========================================================= */}
      {/* IMAGES EXISTANTES */}
      {/* ========================================================= */}
      {existingImages.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {existingImages.map((url) => (
            <div key={url} className="relative group">
              <img
                src={url}
                className="w-full h-24 object-contain rounded-xl border bg-white shadow-sm"
              />

              <button
                type="button"
                onClick={() => onRemoveExisting?.(url)}
                className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
              >
                ✖
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================= */}
      {/* SÉLECTEUR */}
      {/* ========================================================= */}
      <label className="block w-full border-2 border-dashed border-cream-300 bg-cream-100 rounded-xl py-10 text-center cursor-pointer hover:bg-cream-200 transition">
        <input
          type="file"
          multiple
          className="hidden"
          onChange={handleChange}
        />
        <p className="text-sawaka-700 text-sm">
          Téléverser un fichier ou glisser-déposer
        </p>
        <p className="mt-3 inline-block border px-4 py-2 rounded-lg bg-white">
          Sélectionner des images
        </p>
      </label>

      {/* ========================================================= */}
      {/* PRÉVISUALISATION LOCALE */}
      {/* ========================================================= */}
      {preview.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {preview.map((src, i) => (
            <img
              key={i}
              src={src}
              className="w-full h-24 object-contain rounded-xl border bg-white"
            />
          ))}
        </div>
      )}

      {/* ========================================================= */}
      {/* BOUTON UPLOAD */}
      {/* ========================================================= */}
      {preview.length > 0 && (
        <button
          type="button"
          onClick={handleUpload}
          className="mt-4 px-5 py-2 rounded-xl bg-sawaka-700 text-white hover:bg-sawaka-800"
        >
          {uploading ? "Envoi..." : "Importer les images"}
        </button>
      )}
    </div>
  );
}
