const API =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_BACKEND_URL) ||
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE) ||
  "https://ecommerce-web-avec-tailwind.onrender.com";

/* ===========================================================
   👤 TYPE Artisan
=========================================================== */
export type Artisan = {
  _id: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  phone?: string;
  province?: string;
  city?: string;
  commerceName?: string;
  neighborhood?: string;
  idCardImage?: string;
  avatarUrl?: string
  roles?: string[];
  isSeller?: boolean;
  createdAt?: string;
};

/* ===========================================================
   🌍 REQUÊTE GENERIQUE
=========================================================== */
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

/* ===========================================================
   📜 LISTE DES ARTISANS PUBLICS
=========================================================== */
export async function listArtisans() {
  return http<Artisan[]>("/api/artisans");
}

/* ===========================================================
   🔎 UN ARTISAN PAR ID
=========================================================== */
export async function getArtisan(id: string) {
  return http<Artisan>(`/api/artisans/${id}`);
}

/* ===========================================================
   📍 LISTE DES ARTISANS PAR VILLE
=========================================================== */
export async function listArtisansByCity(city: string) {
  return http<Artisan[]>(`/api/artisans?city=${encodeURIComponent(city)}`);
}
