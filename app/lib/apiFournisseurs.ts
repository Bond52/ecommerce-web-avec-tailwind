// src/app/lib/apiFournisseurs.ts

const API =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_BACKEND_URL) ||
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE) ||
  "https://ecommerce-web-avec-tailwind.onrender.com";

export interface Fournisseur {
  _id: string;
  nom: string;
  categorie: string;
  produits: string[];
  telephone: string;
  email: string;
  adresse: string;
  siteweb: string;
  logo: string;
  note: number;
  delaiLivraison: string;
}

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

export async function listFournisseurs() {
  return http<Fournisseur[]>("/api/fournisseurs");
}
