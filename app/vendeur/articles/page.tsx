"use client";

import { useEffect, useMemo, useState } from "react";
import type { Article } from "../../lib/apiSeller";
import { listMyArticles, createArticle, updateArticle, deleteArticle } from "../../lib/apiSeller";


export default function VendorArticlesPage() {
  // Liste + filtres + pagination
  const [data, setData] = useState<{ items: Article[]; total: number; page: number; pages: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");

  // Formulaire
  const emptyForm: Article = useMemo(
    () => ({ title: "", description: "", price: 0, stock: 0, status: "draft", images: [], categories: [], sku: "" }),
    []
  );
  const [form, setForm] = useState<Article>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      {/* Barre d’alerte */}
      {error && <div className="p-3 rounded-xl border border-red-300 bg-red-50 text-red-700">{error}</div>}

      {/* Formulaire */}
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-2xl shadow-sm">
        <input
          className="border p-2 rounded"
          placeholder="Titre"
          required
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        />
        <input
          className="border p-2 rounded"
          placeholder="Prix"
          type="number"
          min={0}
          step="0.01"
          value={form.price}
          onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
        />
        <input
          className="border p-2 rounded"
          placeholder="Stock"
          type="number"
          min={0}
          value={form.stock}
          onChange={(e) => setForm((f) => ({ ...f, stock: Number(e.target.value) }))}
        />
        <input
          className="border p-2 rounded"
          placeholder="SKU (optionnel)"
          value={form.sku ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
        />
        <select
          className="border p-2 rounded"
          value={form.status}
          onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as "draft" | "published" }))}
        >
          <option value="draft">Brouillon</option>
          <option value="published">Publié</option>
        </select>
        <input
          className="border p-2 rounded"
          placeholder="Catégories (séparées par ,)"
          value={(form.categories ?? []).join(",")}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              categories: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
            }))
          }
        />
        <textarea
          className="border p-2 rounded md:col-span-2"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        />
        <input
          className="border p-2 rounded md:col-span-2"
          placeholder="URLs d'images (séparées par ,)"
          value={(form.images ?? []).join(",")}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              images: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
            }))
          }
        />
        <div className="md:col-span-2 flex gap-3">
          <button className="px-4 py-2 rounded-2xl bg-black text-white">
            {editingId ? "Mettre à jour" : "Créer"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="px-4 py-2 rounded-2xl border">
              Annuler
            </button>
          )}
        </div>
      </form>

      {/* Filtres */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <input
          className="border p-2 rounded w-full md:w-80"
          placeholder="Rechercher par titre…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => (e.key === "Enter" ? (setPage(1), load()) : null)}
        />
        <select
          className="border p-2 rounded"
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
        >
          <option value="">Tous</option>
          <option value="published">Publié</option>
          <option value="draft">Brouillon</option>
        </select>
        <button onClick={() => (setPage(1), load())} className="px-3 py-2 rounded border">
          Filtrer
        </button>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto border rounded-2xl">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3">Titre</th>
              <th className="text-left p-3">Prix</th>
              <th className="text-left p-3">Stock</th>
              <th className="text-left p-3">Statut</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="p-3" colSpan={5}>
                  Chargement…
                </td>
              </tr>
            ) : (data?.items ?? []).length ? (
              data!.items.map((a) => (
                <tr key={a._id} className="border-t">
                  <td className="p-3">{a.title}</td>
                  <td className="p-3">{a.price?.toFixed(2)} $</td>
                  <td className="p-3">{a.stock}</td>
                  <td className="p-3">{a.status}</td>
                  <td className="p-3 flex gap-2">
                    <button onClick={() => onEdit(a)} className="px-3 py-1 border rounded">
                      Éditer
                    </button>
                    <button onClick={() => onDelete(a._id)} className="px-3 py-1 border rounded">
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-3" colSpan={5}>
                  Aucun article.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data && data.pages > 1 && (
        <div className="flex gap-2 items-center">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Préc.
          </button>
          <span className="px-2 py-1">
            Page {page} / {data.pages}
          </span>
          <button
            disabled={page >= data.pages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Suiv.
          </button>
        </div>
      )}
    </div>
  );
}
