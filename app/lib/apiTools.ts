// src/app/lib/apiTools.ts
const API =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "https://ecommerce-web-avec-tailwind.onrender.com";

export interface Tool {
  id: string;
  name: string;
  vendor?: string | null;
  price?: string | null;
  children: string[];
  materials?: string[];      // facultatif
  requiredTools?: string[];  // facultatif
}

async function http<T>(path: string) {
  const res = await fetch(`${API}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Erreur API Tools: ${res.status}`);
  return res.json() as Promise<T>;
}

// GET all tools
export function listTools(): Promise<Tool[]> {
  return http<Tool[]>("/api/tools");
}

// GET a single tool
export function getTool(id: string): Promise<Tool> {
  return http<Tool>(`/api/tools/${id}`);
}
