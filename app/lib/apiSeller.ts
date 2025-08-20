// app/lib/apiSeller.ts
const API = process.env.NEXT_PUBLIC_API_BASE ?? "https://sawaka-api.onrender.com";

export type Article = {
  _id?: string;
  title: string;
  description?: string;
  price: number;
  stock: number;
  status: "draft" | "published";
  images?: string[];
  categories?: string[];
  sku?: string;
  createdAt?: string;
  updatedAt?: string;
};

// Lis le token stocké au login: localStorage.setItem("auth_token", token)
function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("auth_token") ?? "";
}

async function http<T = any>(path: string, init?: RequestInit) {
  const token = getToken();
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function listMyArticles(params?: { page?: number; q?: string; status?: string }) {
  const search = new URLSearchParams();
  if (params?.page) search.set("page", String(params.page));
  if (params?.q) search.set("q", params.q);
  if (params?.status) search.set("status", params.status);
  const qs = search.toString();
  return http<{ items: Article[]; total: number; page: number; pages: number }>(
    `/api/seller/articles${qs ? `?${qs}` : ""}`
  );
}

export async function createArticle(payload: Partial<Article>) {
  return http<Article>("/api/seller/articles", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateArticle(id: string, payload: Partial<Article>) {
  return http<Article>(`/api/seller/articles/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteArticle(id: string) {
  return http<{ ok: boolean }>(`/api/seller/articles/${id}`, {
    method: "DELETE",
  });
}
