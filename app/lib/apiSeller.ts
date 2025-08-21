// app/lib/apiSeller.ts
const API = process.env.NEXT_PUBLIC_API_BASE ?? "https://ecommerce-web-avec-tailwind.onrender.com";


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

async function http<T = any>(path: string, init?: RequestInit) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    credentials: "include", // IMPORTANT (Option A) : envoie le cookie
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) throw new Error(await res.text());
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
