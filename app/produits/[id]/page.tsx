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
  status?: string;
  auction?: {
    isActive: boolean;
    highestBid: number;
    highestBidder?: string;
    endDate: string;
  };
}

export default function ProduitDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [newBid, setNewBid] = useState("");

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://ecommerce-web-avec-tailwind.onrender.com";

  // Charger l'article
  useEffect(() => {
    if (!id) return;

    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_BASE}/api/seller/public/${id}`);


        if (!res.ok) {
          throw new Error(`Erreur ${res.status}`);
        }

        const data = await res.json();
        setArticle(data);
      } catch (err) {
        console.error("Erreur chargement article :", err);
        setError("Impossible de charger l'article");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, API_BASE]);

  // Ajouter au panier
  const handleAddToCart = () => {
    if (!article) return;

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item: any) => item._id === article._id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        _id: article._id,
        title: article.title,
        price: article.price,
        image: article.images?.[0] || "/placeholder.png",
        quantity: quantity,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${quantity} article(s) ajouté(s) au panier !`);
  };

  // Like / Unlike
  const handleLike = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!id) return;

    try {
      const res = await fetch(`${API_BASE}/api/seller/articles/${id}/like`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Vous devez être connecté pour aimer un article");
      }

      const data = await res.json();
      setLiked(!!data.liked);

      if (article) {
        const totalLikes = typeof data.totalLikes === "number" ? data.totalLikes : article.likes?.length || 0;
        setArticle({ ...article, likes: Array.from({ length: totalLikes }, () => "x") });
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur lors du like");
    }
  };

  // Ajouter un commentaire
  const handleComment = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!id || !comment.trim()) {
      alert("Veuillez écrire un commentaire");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/seller/articles/${id}/comment`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: comment.trim(), rating }),
      });

      if (!res.ok) {
        throw new Error("Vous devez être connecté pour commenter");
      }

      setComment("");
      setRating(5);

      const refreshRes = await fetch(`${API_BASE}/api/seller/articles/${id}`);
      const refreshedData = await refreshRes.json();
      setArticle(refreshedData);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur lors de l'ajout du commentaire");
    }
  };

  // 🔨 Fonction pour enchérir
  const handleBid = async () => {
    if (!article) return;
    if (!newBid) return alert("Veuillez entrer un montant.");
    const bidAmount = parseFloat(newBid);

    if (isNaN(bidAmount) || bidAmount <= (article.auction?.highestBid || 0)) {
      return alert("Le montant doit être strictement supérieur à l'enchère actuelle.");
    }

    try {
      const res = await fetch(`${API_BASE}/api/auction/${article._id}/bid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ amount: bidAmount }),
      });

      const data = await res.json();
      if (res.ok) {
        setArticle((prev) =>
          prev
            ? { ...prev, auction: { ...prev.auction, highestBid: data.highestBid } }
            : prev
        );
        setNewBid("");
        alert("✅ Enchère placée avec succès !");
      } else {
        alert(data.message || "Erreur lors de l'enchère");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau lors de l'enchère.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-sawaka-600"></div>
          <p className="mt-4 text-sawaka-700">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-sawaka-800 mb-4">Produit introuvable</h1>
          <p className="text-sawaka-600 mb-6">{error || "Ce produit n'existe pas ou a été supprimé"}</p>
          <button onClick={() => router.push("/produits")} className="btn-primary">
            Retour aux produits
          </button>
        </div>
      </div>
    );
  }

  const averageRating = article.comments?.length
    ? (article.comments.reduce((sum, c) => sum + c.rating, 0) / article.comments.length).toFixed(1)
    : "0.0";

  return (
    <div className="bg-cream-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => router.push("/produits")}
          className="flex items-center gap-2 text-sawaka-700 hover:text-sawaka-900 mb-6 transition"
        >
          <ArrowLeft size={20} /> Retour aux produits
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-2xl shadow-lg p-6 lg:p-8">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-cream-100">
              <img
                src={article.images?.[selectedImage] || "/placeholder.png"}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              {article.stock === 0 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">Rupture de stock</span>
                </div>
              )}
            </div>
            {article.images && article.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {article.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === idx
                        ? "border-sawaka-600"
                        : "border-transparent hover:border-sawaka-300"
                    }`}
                  >
                    <img src={img} alt={`${article.title} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Infos produit */}
          <div className="flex flex-col">
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-bold text-sawaka-900 mb-4">{article.title}</h1>
              <p className="text-sawaka-700 mb-6 leading-relaxed">{article.description || "Aucune description disponible."}</p>

              {/* 💰 Section enchère */}
              {article.status === "auction" && article.auction?.isActive ? (
                <div className="border rounded-xl bg-cream-50 p-6 mb-6">
                  <h3 className="text-xl font-semibold text-sawaka-900 mb-3">💰 Vente aux enchères</h3>
                  <p className="text-lg mb-2">
                    Enchère actuelle :{" "}
                    <span className="font-bold text-green-600">
                      {article.auction.highestBid.toLocaleString()} FCFA
                    </span>
                  </p>
                  <p className="text-sawaka-600 mb-4">
                    Se termine le{" "}
                    <span className="font-semibold">
                      {new Date(article.auction.endDate).toLocaleString("fr-FR")}
                    </span>
                  </p>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      value={newBid}
                      onChange={(e) => setNewBid(e.target.value)}
                      placeholder="Votre offre (FCFA)"
                      className="border rounded-lg p-2 flex-1"
                    />
                    <button onClick={handleBid} className="btn-primary">
                      Enchérir
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-cream-100 rounded-xl p-6 mb-6">
                  <p className="text-4xl font-bold text-sawaka-800">
                    {article.price.toLocaleString()} <span className="text-2xl">FCFA</span>
                  </p>
                  <p className="text-sawaka-600 mt-2">
                    Stock disponible: <span className="font-semibold">{article.stock}</span>
                  </p>
                </div>
              )}

              {/* Quantité + Panier */}
{article.status !== "auction" && (
  <div className="mb-6">
    {/* Le panier est désactivé pour le moment */}
    {/*
    <div className="mb-6">
      <label className="block text-sawaka-800 font-medium mb-2">Quantité</label>
      <div className="flex items-center gap-3">
        <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
        <input type="number" value={quantity} />
        <button onClick={() => setQuantity(quantity + 1)}>+</button>
      </div>
    </div>

    <div className="flex gap-3 mb-6">
      <button onClick={handleAddToCart} disabled={article.stock === 0}>
        <ShoppingCart /> Ajouter au panier
      </button>
    </div>
    */}

    {/* 🔥 Nouveau bouton Contact à la place exacte du panier */}
    <button
      onClick={() => router.push(`/artisans/${article.vendorId?._id}`)}
      className="w-full btn-primary flex items-center justify-center gap-2"
    >
      <MessageCircle size={18} /> Contacter l’artisan
    </button>

    {/* Bouton Like laissé en dessous */}
    <div className="mt-4 flex justify-center">
      <button
        type="button"
        onClick={handleLike}
        aria-label={liked ? "Retirer des favoris" : "Ajouter aux favoris"}
        className={`w-12 h-12 rounded-lg transition flex items-center justify-center ${
          liked ? "bg-red-500 text-white" : "border-2 border-red-500 text-red-500 hover:bg-red-50"
        }`}
      >
        <Heart size={20} className={liked ? "fill-current" : ""} />
      </button>
    </div>
  </div>
)}


              <p className="text-sm text-sawaka-600">
                <Heart size={16} className="inline" /> {article.likes?.length || 0} personne(s) aiment ce produit
              </p>
            </div>

            {/* Artisan */}
            {article.vendorId && (
              <div className="mt-6 pt-6 border-t border-sawaka-200">
                <h3 className="text-lg font-semibold text-sawaka-800 mb-3 flex items-center gap-2">
                  <User size={20} /> Artisan
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
                  <button className="mt-3 btn-secondary w-full flex items-center justify-center gap-2">
                    <MessageCircle size={18} /> Contacter l'artisan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Commentaires */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 lg:p-8">
          <h2 className="text-2xl font-bold text-sawaka-900 mb-6">
            Avis clients ({article.comments?.length || 0})
          </h2>
          {/* ... commentaires inchangés ... */}
        </div>
      </div>
    </div>
  );
}
