"use client";

import { useEffect, useMemo, useState } from "react";
import { listMyArticles, createArticle, updateArticle, deleteArticle } from "../../lib/apiSeller";
import type { Article } from "../../lib/apiSeller";

/* ============================================================
   📸 Upload Component (réutilisé)
============================================================ */


function UploadImages({
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
    "https://ecommerce-web-avec-tailwind.onrender.com";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files ? Array.from(e.target.files) : [];
    if (selected.length) {
      setFiles((prev) => [...prev, ...selected]);
      setPreview((prev) => [...prev, ...selected.map((f) => URL.createObjectURL(f))]);
    }
  };

  const handleUpload = async () => {
    if (!files.length) return;

    setUploading(true);
    const formData = new FormData();
    files.forEach((f) => formData.append("images", f));

    const res = await fetch(`${API_BASE}/api/seller/upload`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const data = await res.json();
    onUploadComplete(data.urls);

    setFiles([]);
    setPreview([]);
    setUploading(false);
  };

  return (
    <div className="border-2 border-dashed border-cream-300 rounded-2xl p-10 bg-cream-50">
      <div className="flex flex-col items-center gap-4">

        {/* ======================= */}
        {/* IMAGES DÉJÀ EXISTANTES */}
        {/* ======================= */}
        {existingImages.length > 0 && (
          <div className="grid grid-cols-3 gap-4 w-full mb-6">
            {existingImages.map((url) => (
              <div key={url} className="relative group">
                <img
                  src={url}
                  className="rounded-xl border object-cover w-full h-28"
                  alt="image produit"
                />

                <button
                  type="button"
                  onClick={() => onRemoveExisting && onRemoveExisting(url)}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-80 hover:opacity-100 hidden group-hover:block"
                >
                  ✖
                </button>
              </div>
            ))}
          </div>
        )}

        <p className="text-sawaka-700 text-sm">
          Téléverser un fichier ou glisser-déposer  
        </p>
        <input type="file" multiple onChange={handleChange} className="hidden" id="fileInput" />
        <label
          htmlFor="fileInput"
          className="px-4 py-2 rounded-xl border border-sawaka-300 cursor-pointer hover:bg-cream-100"
        >
          Sélectionner des images
        </label>

        {/* Préviews locales */}
        {preview.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-4 w-full">
            {preview.map((src, i) => (
              <img key={i} src={src} className="h-28 rounded-xl border object-cover w-full" />
            ))}
          </div>
        )}

        {preview.length > 0 && (
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="btn btn-primary mt-4"
          >
            {uploading ? "Envoi..." : "Importer les images"}
          </button>
        )}
      </div>
    </div>
  );
}







/* ============================================================
   🧵 PAGE RESPÉRANT EXACTEMENT TON MOCKUP
============================================================ */
export default function VendorArticlesPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");

const emptyForm: Article = {
  title: "",
  description: "",
  price: 0,
  stock: 0,
  status: "draft",
  images: [],
  categories: [],
  sku: "",
  promotion: {
    isActive: false,
    discountPercent: 0,
    newPrice: 0,
    durationDays: 0,
    durationHours: 0,
    startDate: "",
    endDate: "",
  },
  auction: {
    isActive: false,
    endDate: "",
    highestBid: 0,
  },
};


  const [form, setForm] = useState<Article>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await listMyArticles({ page, q: "", status });
    setData(res);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [page, status]);

  function onEdit(a: Article) {
    setEditingId(a._id!);
    setForm(a);
  }

  async function onDelete(id?: string) {
    if (!id) return;
    if (confirm("Supprimer ?")) {
      await deleteArticle(id);
      load();
    }
  }

  async function onSubmit(e: any) {
    e.preventDefault();
    if (editingId) {
      await updateArticle(editingId, form);
    } else {
      await createArticle(form);
    }
    setForm(emptyForm);
    setEditingId(null);
    load();
  }

  const categoriesList = [
    "Mode & Accessoires",
    "Maison & Décoration",
    "Art & Artisanat",
    "Beauté & Bien-être",
    "Bijoux",
    "Textile",
  ];

  return (
    <div className="wrap py-10 space-y-12">

      {/* ========================= */}
      {/* TITRE + STATS */}
      {/* ========================= */}
      <div>
        <h1 className="font-display text-3xl text-sawaka-900 mb-1">
          Mes créations
        </h1>
        <p className="text-sawaka-700">
          Gérez votre inventaire et ajoutez de nouveaux produits artisanaux.
        </p>
      </div>

      <div className="flex gap-6">
        <div className="bg-white border border-cream-200 shadow-card rounded-2xl p-4 w-40 text-center">
          <p className="text-xs text-sawaka-600">TOTAL PRODUITS</p>
          <p className="text-2xl font-semibold text-sawaka-800">{data?.total ?? 0}</p>
        </div>

        <div className="bg-white border border-cream-200 shadow-card rounded-2xl p-4 w-40 text-center">
          <p className="text-xs text-sawaka-600">EN VENTE</p>
          <p className="text-2xl font-semibold text-green-600">
            {data?.items?.filter((a: any) => a.status === "published").length ?? 0}
          </p>
        </div>
      </div>

      {/* ========================= */}
      {/* FORMULAIRE — TOUTE LA CARTE */}
      {/* ========================= */}
      <form
        onSubmit={onSubmit}
        className="bg-white border border-cream-200 shadow-card rounded-2xl p-8 space-y-6"
      >
        <h2 className="font-display text-2xl text-sawaka-900 mb-6">
          Ajouter un nouveau produit
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <Input
            label="Titre de l'article"
            placeholder="Ex: Vase en terre cuite"
            value={form.title}
            onChange={(v) => setForm({ ...form, title: v })}
          />

          <Select
            label="Catégorie"
            value={form.categories?.[0] || ""}
            onChange={(v) => setForm({ ...form, categories: [v] })}
            options={categoriesList}
          />

          <Input
            label="Prix (FCFA)"
            value={form.price}
            type="number"
            onChange={(v) => setForm({ ...form, price: Number(v) })}
          />

          <Input
            label="Stock"
            type="number"
            value={form.stock}
            onChange={(v) => setForm({ ...form, stock: Number(v) })}
          />

          <Input
            label="SKU (Optionnel)"
            placeholder="Ex: CHAP-001"
            value={form.sku ?? ""}
            onChange={(v) => setForm({ ...form, sku: v })}
          />

          <Select
            label="Statut"
            value={form.status}
            onChange={(v) => setForm({ ...form, status: v })}
            options={["draft", "published"]}
            displayMap={{ draft: "Brouillon", published: "Publié" }}
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm text-sawaka-800 mb-1 block">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border border-gray-300 rounded-xl p-4 w-full h-32"
            placeholder="Décrivez votre création..."
          />
        </div>
        {/* ====================================== */}
        {/* 📸 UPLOAD IMAGES — Style IDENTIQUE UI */}
        {/* ====================================== */}
        <div>
          <label className="text-sm text-sawaka-800 mb-2 block">
            Galerie Photos
          </label>

          <UploadImages
            onUploadComplete={(urls) =>
              setForm((f) => ({ ...f, images: urls }))
            }
          />
        </div>

        {/* ====================================== */}
        {/* 💸 PROMOTION */}
        {/* ====================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

          {/* Left: Checkbox */}
          <label className="flex items-center gap-2 text-sawaka-800 mt-4">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={form.promotion?.isActive || false}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  promotion: { ...f.promotion, isActive: e.target.checked },
                }))
              }
            />
            Activer une promotion
          </label>

          {/* Right: explanation */}
          <p className="text-xs text-sawaka-600 mt-4">
            Le produit apparaîtra dans la section "Promotions".
          </p>
        </div>

        {/* ============================ */}
        {/* Champs visibles si actif     */}
        {/* ============================ */}
        {form.promotion?.isActive && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Nouveau prix */}
            <div>
              <label className="text-sm text-sawaka-800 mb-1 block">
                Nouveau prix (FCFA)
              </label>
              <input
                type="number"
                value={form.promotion?.newPrice || ""}
                onChange={(e) => {
                  const newPrice = Number(e.target.value || "0");
                  const discountPercent =
                    form.price > 0
                      ? Math.round(((form.price - newPrice) / form.price) * 100)
                      : 0;

                  setForm((f) => ({
                    ...f,
                    promotion: { ...f.promotion, newPrice, discountPercent },
                  }));
                }}
                className="border border-gray-300 rounded-xl p-3 w-full"
              />
            </div>

            {/* Pourcentage de réduction */}
            <div>
              <label className="text-sm text-sawaka-800 mb-1 block">
                Réduction (%)
              </label>
              <input
                type="number"
                value={form.promotion?.discountPercent || ""}
                onChange={(e) => {
                  const discountPercent = Number(e.target.value || "0");
                  const newPrice =
                    form.price > 0
                      ? Math.round(form.price * (1 - discountPercent / 100))
                      : 0;

                  setForm((f) => ({
                    ...f,
                    promotion: { ...f.promotion, discountPercent, newPrice },
                  }));
                }}
                className="border border-gray-300 rounded-xl p-3 w-full"
              />
            </div>
          </div>
        )}

        {/* ====================================== */}
        {/* CTA BUTTON */}
        {/* ====================================== */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl font-semibold bg-sawaka-600 text-white hover:bg-sawaka-700 flex items-center gap-2"
          >
            + Créer le produit
          </button>
        </div>
      </form>
      {/* ======================================================= */}
      {/* 📦 INVENTAIRE ACTUEL */}
      {/* ======================================================= */}

      <h2 className="font-display text-2xl text-sawaka-900 mt-10">
        Inventaire actuel
      </h2>

      <div className="bg-white border border-cream-200 rounded-2xl shadow-card p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-sawaka-700 text-xs border-b bg-cream-50">
                <th className="p-3 text-left">TITRE</th>
                <th className="p-3 text-left">PRIX</th>
                <th className="p-3 text-left">STOCK</th>
                <th className="p-3 text-left">CATÉGORIE</th>
                <th className="p-3 text-left">STATUT</th>
                <th className="p-3 text-left">PROMO</th>
                <th className="p-3 text-left">ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-4 text-center">
                    Chargement…
                  </td>
                </tr>
              ) : data?.items?.length ? (
                data.items.map((a: Article) => (
                  <tr key={a._id} className="border-b last:border-0">
                    {/* Titre */}
                    <td className="p-3 font-medium text-sawaka-900">
                      {a.title}
                    </td>

                    {/* Prix */}
                    <td className="p-3">{a.price?.toLocaleString()} FCFA</td>

                    {/* Stock */}
                    <td className="p-3">{a.stock}</td>

                    {/* Catégorie */}
                    <td className="p-3">
                      {a.categories?.length ? (
                        <span className="px-3 py-1 rounded-full bg-cream-100 text-sawaka-800 text-xs">
                          {a.categories[0]}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>

                    {/* Statut */}
                    <td className="p-3">
                      {a.status === "published" ? (
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                          ● Publié
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-xs font-semibold">
                          ● Brouillon
                        </span>
                      )}
                    </td>

                    {/* Promotion */}
                    <td className="p-3">
                      {a.promotion?.isActive ? (
                        <span className="text-sawaka-800 font-medium">
                          {a.promotion.discountPercent}%{" "}
                          <span className="text-xs text-sawaka-600">
                            ({a.promotion.newPrice} FCFA)
                          </span>
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-3 flex gap-3">
                      <button
                        onClick={() => onEdit(a)}
                        className="text-sawaka-700 hover:underline"
                      >
                        Éditer
                      </button>

                      <button
                        onClick={() => onDelete(a._id)}
                        className="text-red-600 hover:underline"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-sawaka-700">
                    Aucun article trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ======================================================= */}
        {/* PAGINATION */}
        {/* ======================================================= */}
        <div className="flex items-center justify-between mt-4 text-sm text-sawaka-700">
          <p>
            Affichage de {data?.items?.length ?? 0} sur {data?.total ?? 0} résultats
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-3 py-1 rounded-lg border ${
                page === 1
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-cream-50"
              }`}
            >
              Préc.
            </button>

            <button
              onClick={() => setPage((p) => Math.min(data?.pages ?? 1, p + 1))}
              disabled={page === data?.pages}
              className={`px-3 py-1 rounded-lg border ${
                page === data?.pages
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-cream-50"
              }`}
            >
              Suiv.
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ======================================================= */
/* 🔧 INPUT + SELECT Components (identiques au mockup UI)  */
/* ======================================================= */
function Input({ label, value, onChange, placeholder, type = "text", numeric }: any) {
  return (
    <div>
      <label className="text-sm text-sawaka-800 mb-1 block">{label}</label>

      <input
        type="text"
        inputMode={numeric ? "numeric" : undefined}
        pattern={numeric ? "[0-9]*" : undefined}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          const raw = e.target.value;

          if (!numeric) return onChange(raw);

          // Autorise uniquement les chiffres 0-9
          const digits = raw.replace(/\D/g, "");

          onChange(digits === "" ? 0 : Number(digits));
        }}
        onKeyDown={(e) => {
          if (!numeric) return;
          // Interdire :, -, ., e, + etc.
          const forbidden = ["-", "+", "e", "E", ".", ","];
          if (forbidden.includes(e.key)) e.preventDefault();
        }}
        className="border border-gray-300 rounded-xl p-3 w-full"
      />
    </div>
  );
}


function Select({ label, value, onChange, options, displayMap }: any) {
  return (
    <div>
      <label className="text-sm text-sawaka-800 mb-1 block">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded-xl p-3 w-full"
      >
        <option value="">-- Choisir une option --</option>
        {options.map((opt: string) => (
          <option key={opt} value={opt}>
            {displayMap?.[opt] ?? opt}
          </option>
        ))}
      </select>
    </div>
  );
}
