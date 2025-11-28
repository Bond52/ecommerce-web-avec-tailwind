// app/lib/apiSeller.ts

/* ============================================
   🌍 API BASE URL
============================================ */
const API =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_BACKEND_URL) ||
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE) ||
  "https://ecommerce-web-avec-tailwind.onrender.com";

/* ============================================
   📦 TYPE Article
============================================ */
export type Article = {
  _id?: string;
  title: string;
  description?: string;
  price: number;
  stock: number;
  status: "draft" | "published" | "auction";
  images?: string[];
  categories?: string[];
  sku?: string;
  createdAt?: string;
  updatedAt?: string;

  promotion?: {
    isActive: boolean;
    discountPercent: number;
    newPrice: number;
    durationDays: number;
    durationHours: number;
    startDate?: string;
    endDate?: string;
  };

  auction?: {
    isActive: boolean;
    endDate: string | Date;
    highestBid: number;
    highestBidder?: string;
  };
};

/* ============================================
   🌍 GENERIC HTTP WRAPPER
============================================ */
async function http<T = any>(path: string, init?: RequestInit) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Erreur HTTP ${res.status} sur ${path}`);
  }

  return res.json() as Promise<T>;
}

/* ============================================
   📰 PUBLIC ARTICLES
============================================ */
export async function listPublicArticles() {
  const data = await http<{ items?: Article[] }>(
    "/api/seller/public",
    { method: "GET" }
  );

  if (Array.isArray(data)) return data;
  if (Array.isArray(data.items)) return data.items;
  return [];
}

/* ============================================
   👤 MY ARTICLES (SELLER)
============================================ */
export async function listMyArticles(params?: {
  page?: number;
  q?: string;
  status?: string;
}) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.q) qs.set("q", params.q);
  if (params?.status) qs.set("status", params.status);

  return http<{ items: Article[]; total: number; page: number; pages: number }>(
    `/api/seller/articles${qs.toString() ? `?${qs}` : ""}`
  );
}

/* ============================================
   ✏️ CREATE ARTICLE
============================================ */
export async function createArticle(data: Article) {
  const res = await fetch(`${API}/api/seller/articles`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...data,
      images: data.images ?? [],
    }),
  });

  return res.json();
}

/* ============================================
   ✏️ UPDATE ARTICLE
============================================ */
export async function updateArticle(id: string, data: Article) {
  const res = await fetch(`${API}/api/seller/articles/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...data,
      images: data.images ?? [],
    }),
  });

  return res.json();
}

/* ============================================
   ❌ DELETE ARTICLE
============================================ */
export async function deleteArticle(id: string) {
  return http<{ ok: boolean }>(`/api/seller/articles/${id}`, {
    method: "DELETE",
  });
}
