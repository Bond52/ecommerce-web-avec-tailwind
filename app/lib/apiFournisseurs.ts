// src/app/lib/apiFournisseurs.ts

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

// Récupère tous les fournisseurs depuis ton backend Node.js
export async function getFournisseurs(): Promise<Fournisseur[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fournisseurs`, {
    cache: "no-store", // pour toujours récupérer la version la plus à jour
  });

  if (!res.ok) {
    throw new Error("Erreur lors du chargement des fournisseurs");
  }

  return res.json();
}
