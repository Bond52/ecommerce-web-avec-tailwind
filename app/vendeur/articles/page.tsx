"use client";

import { useEffect, useMemo, useState } from "react";
import type { Article } from "../../lib/apiSeller";
import {
  listMyArticles,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../../lib/apiSeller";

/* ============================================================
   🔼 Composant Upload Cloudinary
============================================================ */
function UploadImages({
  onUploadComplete,
}: {
  onUploadComplete: (urls: string[]) => void;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const API_BASE =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://ecommerce-web-avec-tailwind.onrender.com";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files ? Array.from(e.target.files) : [];
    if (selected.length > 0) {
      const previews = selected.map((f) => URL.createObjectURL(f));
      setFiles((prev) => [...prev, ...selected]);
      setPreview((prev) => [...prev, ...previews]);
    }
  };

  const handleRemove = (index: number) => {
    const newFiles = [...files];
    const newPreview = [...preview];
    newFiles.splice(index, 1);
    newPreview.splice(index, 1);
    setFiles(newFiles);
    setPreview(newPreview);
  };

  const handleUpload = async () => {
    if (files.length === 0) return alert("Choisissez au moins une image !");
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    files.forEach((f) => formData.append("images", f));

    try {
      const res = await fetch(`${API_BASE}/api/seller/upload`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Erreur lors de l’upload");
      const data = await res.json();

      onUploadComplete(data.urls);
      alert("✅ Upload réussi !");
      setFiles([]);
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
    <div className="border rounded-lg p-4 bg-white shadow-sm md:col-span-2">
      <h3 className="text-lg font-semibold mb-3">📸 Ajouter des images</h3>

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full border p-2 rounded mb-3"
      />

      {files.length > 0 && (
        <p className="text-sm text-gray-600 mb-2">
          {files.length} image{files.length > 1 ? "s" : ""} sélectionnée
          {files.length > 1 ? "s" : ""}
        </p>
      )}

      {preview.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-3">
          {preview.map((src, i) => (
            <div key={i} className="relative group">
              <img
                src={src}
                alt={`Preview ${i}`}
                className="w-full h-32 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-80 hover:opacity-100 hidden group-hover:block"
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      )}

      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
          <div
            className="bg-sawaka-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={uploading}
        className={`px-4 py-2 rounded text-white ${
          uploading ? "bg-gray-400" : "bg-sawaka-600 hover:bg-sawaka-700"
        }`}
      >
        {uploading ? "⏳ Upload en cours..." : "⬆️ Envoyer sur Cloudinary"}
      </button>
    </div>
  );
}

/* ============================================================
   🧺 PAGE VENDEUR : GESTION DES ARTICLES
============================================================ */
export default function VendorArticlesPage() {
  const [data, setData] = useState<{
    items: Article[];
    total: number;
    page: number;
    pages: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");

  const emptyForm: Article = useMemo(
    () => ({
      title: "",
      description: "",
      price: 0,
      stock: 0,
      status: "draft",
      images: [],
      categories: [],
      sku: "",
    }),
    []
  );

  const [form, setForm] = useState<Article>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  // 📚 Liste des catégories affichées sur la page d’accueil
  const categoriesList = [
    "Mode & Accessoires",
    "Maison & Décoration",
    "Art & Artisanat",
    "Beauté & Bien-être",
    "Bijoux",
    "Textile",
  ];

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await listMyArticles({ page, q, status });
      setData(res);
    } catch (e: any) {
      setError(e?.message ?? "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [page, status]);

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await updateArticle(editingId, form);
      } else {
        await createArticle(form);
      }
      resetForm();
      await load();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e: any) {
      setError(e?.message ?? "Erreur lors de l’enregistrement");
    }
  }

  function onEdit(a: Article) {
    setEditingId(a._id!);
    setForm({
      _id: a._id,
      title: a.title,
      description: a.description ?? "",
      price: a.price ?? 0,
      stock: a.stock ?? 0,
      status: a.status,
      images: a.images ?? [],
      categories: a.categories ?? [],
      sku: a.sku ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onDelete(id?: string) {
    if (!id) return;
    if (!confirm("Supprimer cet article ?")) return;
    setError("");
    try {
      await deleteArticle(id);
      await load();
    } catch (e: any) {
      setError(e?.message ?? "Suppression impossible");
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Mes articles</h1>

      {error && (
        <div className="p-3 rounded-xl border border-red-300 bg-red-50 text-red-700">
          {error}
        </div>
      )}

      {/* 🧾 Formulaire de création/modification */}
      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-2xl shadow-sm"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Titre</label>
          <input
            className="border p-2 rounded w-full"
            placeholder="Titre de l’article"
            required
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Prix (FCFA)</label>
          <input
            className="border p-2 rounded w-full"
            placeholder="Ex: 10000"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={form.price}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                price: parseInt(e.target.value || "0"),
              }))
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Nombre d’articles</label>
          <input
            className="border p-2 rounded w-full"
            placeholder="Ex: 5"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={form.stock}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                stock: parseInt(e.target.value || "0"),
              }))
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">SKU (optionnel)</label>
          <input
            className="border p-2 rounded w-full"
            placeholder="Ex: CHAP-001"
            value={form.sku ?? ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, sku: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Statut</label>
          <select
            className="border p-2 rounded w-full"
            value={form.status}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                status: e.target.value as "draft" | "published",
              }))
            }
          >
            <option value="draft">Brouillon</option>
            <option value="published">Publié</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Catégorie</label>
          <select
            className="border p-2 rounded w-full"
            value={form.categories?.[0] || ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, categories: [e.target.value] }))
            }
          >
            <option value="">-- Sélectionner une catégorie --</option>
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="border p-2 rounded w-full"
            placeholder="Décrivez votre article"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
          />
        </div>

        {/* 📸 Upload images */}
        <UploadImages
          onUploadComplete={(urls) =>
            setForm((f) => ({ ...f, images: urls }))
          }
        />

        <div className="md:col-span-2 flex gap-3">
          <button className="px-4 py-2 rounded-2xl bg-black text-white">
            {editingId ? "Mettre à jour" : "Créer"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-2xl border"
            >
              Annuler
            </button>
          )}
        </div>
      </form>

      {/* 🗂 Tableau des articles */}
      <div className="overflow-x-auto border rounded-2xl">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3">Titre</th>
              <th className="text-left p-3">Prix</th>
              <th className="text-left p-3">Stock</th>
              <th className="text-left p-3">Catégorie</th>
              <th className="text-left p-3">Statut</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-3">
                  Chargement…
                </td>
              </tr>
            ) : (data?.items ?? []).length ? (
              data!.items.map((a) => (
                <tr key={a._id} className="border-t">
                  <td className="p-3">{a.title}</td>
                  <td className="p-3">{a.price?.toFixed(0)} FCFA</td>
                  <td className="p-3">{a.stock}</td>
                  <td className="p-3">
                    {a.categories?.length ? a.categories.join(", ") : "-"}
                  </td>
                  <td className="p-3">{a.status}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => onEdit(a)}
                      className="px-3 py-1 border rounded"
                    >
                      Éditer
                    </button>
                    <button
                      onClick={() => onDelete(a._id)}
                      className="px-3 py-1 border rounded text-red-500"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-3">
                  Aucun article.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
