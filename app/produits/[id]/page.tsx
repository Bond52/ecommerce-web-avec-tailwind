"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShoppingCart, Heart, Star, User, MessageCircle, ArrowLeft } from "lucide-react";

interface Comment {
  _id?: string;
  user?: { username?: string; firstName?: string; lastName?: string };
  text: string;
  rating: number;
  createdAt?: string;
}

interface Article {
  _id: string;
  title: string;
  description?: string;
  price: number;
  stock: number;
  images?: string[];
  likes?: string[];
  comments?: Comment[];
  categories?: string[];
  vendorId?: {
    _id: string;
    username?: string;
    commerceName?: string;
    city?: string;
    province?: string;
  };
}

export default function ProduitDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [liked, setLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

  // Charger les données du produit
  useEffect(() => {
    if (!id) return;
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/seller/articles/${id}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Erreur lors du chargement du produit");
        const data = await res.json();
        setArticle(data);
      } catch (err) {
        setError("Impossible de charger le produit");
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id, API_BASE]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-b-2 border-sawaka-500 rounded-full mx-auto"></div>
          <p className="mt-4 text-sawaka-700">Chargement du produit...</p>
        </div>
      </div>
    );

  if (error || !article)
    return (
      <div className="min-h-screen flex items-center justify-center flex-col text-center">
        <h1 className="text-2xl font-bold text-sawaka-800 mb-4">Produit introuvable</h1>
        <p className="text-sawaka-600 mb-4">{error || "Ce produit n’existe pas."}</p>
        <button
          onClick={() => router.push("/produits")}
          className="bg-sawaka-500 text-white px-4 py-2 rounded-lg hover:bg-sawaka-600 transition"
        >
          Retour aux produits
        </button>
      </div>
    );

  const averageRating = article.comments?.length
    ? (
        article.comments.reduce((sum, c) => sum + c.rating, 0) /
        article.comments.length
      ).toFixed(1)
    : "0.0";

  return (
    <div className="bg-cream-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Bouton retour */}
        <button
          onClick={() => router.push("/produits")}
          className="flex items-center gap-2 text-sawaka-700 hover:text-sawaka-900 mb-6"
        >
          <ArrowLeft size={20} /> Retour aux produits
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-2xl shadow-lg p-6">
          {/* Image principale */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-cream-100">
              <img
                src={article.images?.[selectedImage] || "/placeholder.png"}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Miniatures */}
            {article.images && article.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {article.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-lg border-2 transition ${
                      selectedImage === idx
                        ? "border-sawaka-600"
                        : "border-transparent hover:border-sawaka-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${article.title} ${idx + 1}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Détails produit */}
          <div>
            <h1 className="text-3xl font-bold text-sawaka-900 mb-2">
              {article.title}
            </h1>
            <p className="text-sawaka-600 mb-4">{article.description}</p>

            {/* Note moyenne */}
            <div className="flex items-center gap-3 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={20}
                  className={
                    star <= parseFloat(averageRating)
                      ? "fill-amber-500 text-amber-500"
                      : "text-gray-300"
                  }
                />
              ))}
              <span className="text-sawaka-700">
                {averageRating} ({article.comments?.length || 0} avis)
              </span>
            </div>

            {/* Prix et stock */}
            <div className="bg-cream-100 rounded-xl p-6 mb-6">
              <p className="text-4xl font-bold text-sawaka-800">
                {article.price.toLocaleString()} <span className="text-2xl">FCFA</span>
              </p>
              <p className="text-sawaka-600 mt-2">
                Stock disponible :{" "}
                <span className="font-semibold">{article.stock}</span>
              </p>
            </div>

            {/* Quantité et boutons */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-sawaka-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2"
                >
                  −
                </button>
                <span className="px-4 py-2">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2"
                >
                  +
                </button>
              </div>
              <button className="flex-1 bg-sawaka-600 text-white py-3 rounded-lg hover:bg-sawaka-700 transition">
                <ShoppingCart size={20} className="inline mr-2" />
                Ajouter au panier
              </button>
              <button
                className={`p-3 rounded-lg border-2 ${
                  liked
                    ? "bg-red-500 text-white border-red-500"
                    : "border-red-400 text-red-500 hover:bg-red-50"
                }`}
                onClick={() => setLiked(!liked)}
              >
                <Heart size={20} />
              </button>
            </div>

            {/* Artisan */}
            {article.vendorId && (
              <div className="border-t pt-4 mt-6">
                <h3 className="text-lg font-semibold text-sawaka-800 mb-2 flex items-center gap-2">
                  <User size={18} /> Artisan
                </h3>
                <div className="bg-cream-50 rounded-lg p-4">
                  <p className="font-semibold text-sawaka-900">
                    {article.vendorId.commerceName || article.vendorId.username}
                  </p>
                  {article.vendorId.city && (
                    <p className="text-sawaka-600 text-sm">
                      {article.vendorId.city}, {article.vendorId.province}
                    </p>
                  )}
                  <button className="mt-3 btn-secondary w-full flex items-center justify-center gap-2 border border-sawaka-400 rounded-lg py-2 hover:bg-sawaka-50 transition">
                    <MessageCircle size={18} /> Contacter l’artisan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
