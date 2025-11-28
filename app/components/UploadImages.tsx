"use client";

import { useState } from "react";

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
    "http://localhost:5000";

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files ? Array.from(e.target.files) : [];
    if (!selected.length) return;

    setFiles((prev) => [...prev, ...selected]);
    setPreview((prev) => [...prev, ...selected.map((f) => URL.createObjectURL(f))]);
  }

  async function handleUpload() {
    if (!files.length) return;

    const formData = new FormData();
    files.forEach((f) => formData.append("images", f));

    setUploading(true);
    const res = await fetch(`${API_BASE}/api/seller/upload`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data = await res.json();

    // 🔥 IMPORTANT : renvoie au parent exactement ce que le backend attend
    onUploadComplete(data.urls);

    setFiles([]);
    setPreview([]);
    setUploading(false);
  }

  return (
    <div className="border p-4 bg-white rounded-xl space-y-4">

      {/* IMAGES EXISTANTES */}
      {existingImages.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {existingImages.map((url) => (
            <div key={url} className="relative group">
              <img
                src={url}
                className="w-full h-24 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => onRemoveExisting?.(url)}
                className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100"
              >
                ✖
              </button>
            </div>
          ))}
        </div>
      )}

      {/* SELECTEUR */}
      <label className="block border-2 border-dashed p-6 rounded-lg text-center cursor-pointer bg-gray-50">
        <input type="file" multiple accept="image/*" className="hidden" onChange={handleChange} />
        <p>Choisir des images</p>
      </label>

      {/* PREVIEW LOCALE */}
      {preview.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {preview.map((src, i) => (
            <img key={i} src={src} className="w-full h-24 object-cover rounded-lg border" />
          ))}
        </div>
      )}

      {/* BOUTON UPLOAD */}
      {preview.length > 0 && (
        <button
          type="button"
          onClick={handleUpload}
          className="px-4 py-2 bg-sawaka-600 text-white rounded-lg"
        >
          {uploading ? "Envoi..." : "Envoyer les images"}
        </button>
      )}
    </div>
  );
}