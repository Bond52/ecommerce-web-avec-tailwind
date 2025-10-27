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
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

  // Charger l'article
  useEffect(() => {
    if (!id) return;

    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_BASE}/api/seller/articles/${id}`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`Erreur ${res.status}`);
        }

        const data = await res.json();
        setArticle(data);
        setLoading(false);
      } catch (err) {
        console.error("Erreur chargement article :", err);
        setError("Impossible de charger l'article");
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

      // Mettre à jour le nombre de likes
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

      // Recharger l'article pour afficher le nouveau commentaire
      const refreshRes = await fetch(`${API_BASE}/api/seller/articles/${id}`);
      const refreshedData = await refreshRes.json();
      setArticle(refreshedData);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur lors de l'ajout du commentaire");
    }
  };

  // Affichage du chargement
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

  // Affichage des erreurs
  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-sawaka-800 mb-4">Produit introuvable</h1>
          <p className="text-sawaka-600 mb-6">{error || "Ce produit n'existe pas ou a été supprimé"}</p>
          <button
            onClick={() => router.push("/produits")}
            className="btn-primary"
          >
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
        {/* Bouton retour */}
        <button
          onClick={() => router.push("/produits")}
          className="flex items-center gap-2 text-sawaka-700 hover:text-sawaka-900 mb-6 transition"
        >
          <ArrowLeft size={20} />
          Retour aux produits
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-2xl shadow-lg p-6 lg:p-8">
          {/* Galerie d'images */}
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

            {/* Miniatures */}
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

          {/* Informations produit */}
          <div className="flex flex-col">
            <div className="flex-1">
              {/* Catégories */}
              {article.categories && article.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {article.categories.map((cat, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-sawaka-100 text-sawaka-800 text-sm rounded-full"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              )}

              <h1 className="text-3xl lg:text-4xl font-bold text-sawaka-900 mb-4">
                {article.title}
              </h1>

              {/* Note moyenne */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
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
                </div>
                <span className="text-sawaka-700">
                  {averageRating} ({article.comments?.length || 0} avis)
                </span>
              </div>

              <p className="text-sawaka-700 mb-6 leading-relaxed">
                {article.description || "Aucune description disponible."}
              </p>

              {/* Prix */}
              <div className="bg-cream-100 rounded-xl p-6 mb-6">
                <p className="text-4xl font-bold text-sawaka-800">
                  {article.price.toLocaleString()} <span className="text-2xl">FCFA</span>
                </p>
                <p className="text-sawaka-600 mt-2">
                  Stock disponible: <span className="font-semibold">{article.stock}</span>
                </p>
              </div>

              {/* Quantité */}
              <div className="mb-6">
                <label className="block text-sawaka-800 font-medium mb-2">Quantité</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border-2 border-sawaka-300 text-sawaka-800 hover:bg-sawaka-50 transition"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(article.stock, parseInt(e.target.value) || 1)))}
                    className="w-20 h-10 text-center border-2 border-sawaka-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sawaka-500"
                    min="1"
                    max={article.stock}
                  />
                  <button
                    onClick={() => setQuantity(Math.min(article.stock, quantity + 1))}
                    className="w-10 h-10 rounded-lg border-2 border-sawaka-300 text-sawaka-800 hover:bg-sawaka-50 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={article.stock === 0}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart size={20} />
                  Ajouter au panier
                </button>
                <button
                  type="button"
                  onClick={handleLike}
                  aria-label={liked ? "Retirer des favoris" : "Ajouter aux favoris"}
                  className={`w-12 h-12 rounded-lg transition flex items-center justify-center ${
                    liked
                      ? "bg-red-500 text-white"
                      : "border-2 border-red-500 text-red-500 hover:bg-red-50"
                  }`}
                >
                  <Heart size={20} className={liked ? "fill-current" : ""} />
                </button>
              </div>

              <p className="text-sm text-sawaka-600">
                <Heart size={16} className="inline" /> {article.likes?.length || 0} personne(s) aiment ce produit
              </p>
            </div>

            {/* Informations vendeur */}
            {article.vendorId && (
              <div className="mt-6 pt-6 border-t border-sawaka-200">
                <h3 className="text-lg font-semibold text-sawaka-800 mb-3 flex items-center gap-2">
                  <User size={20} />
                  Artisan
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
                    <MessageCircle size={18} />
                    Contacter l'artisan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section Commentaires */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 lg:p-8">
          <h2 className="text-2xl font-bold text-sawaka-900 mb-6">
            Avis clients ({article.comments?.length || 0})
          </h2>

          {/* Formulaire d'ajout de commentaire */}
          <div className="bg-cream-50 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-sawaka-800 mb-4">Laisser un avis</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="rating-select" className="block text-sawaka-700 mb-2">Votre note</label>
                <div className="flex gap-2" role="group" aria-label="Sélectionnez votre note">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      aria-label={`${star} étoile${star > 1 ? 's' : ''}`}
                      className="transition hover:scale-110"
                    >
                      <Star
                        size={32}
                        className={
                          star <= rating
                            ? "fill-amber-500 text-amber-500"
                            : "text-gray-300 hover:text-amber-300"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sawaka-700 mb-2">Votre commentaire</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Partagez votre expérience avec ce produit..."
                  rows={4}
                  className="w-full border-2 border-sawaka-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sawaka-500 resize-none"
                />
              </div>

              <button
                type="button"
                onClick={handleComment}
                disabled={!comment.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Publier mon avis
              </button>
            </div>
          </div>

          {/* Liste des commentaires */}
          <div className="space-y-4">
            {article.comments && article.comments.length > 0 ? (
              article.comments.map((c, idx) => (
                <div key={c._id || idx} className="border-b border-sawaka-200 pb-4 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-sawaka-900">
                        {c.user?.firstName || c.user?.username || "Utilisateur anonyme"}
                      </p>
                      <div className="flex gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            className={
                              star <= c.rating
                                ? "fill-amber-500 text-amber-500"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                    </div>
                    {c.createdAt && (
                      <span className="text-sm text-sawaka-500">
                        {new Date(c.createdAt).toLocaleDateString("fr-FR")}
                      </span>
                    )}
                  </div>
                  <p className="text-sawaka-700">{c.text}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-sawaka-500 py-8">
                Aucun avis pour le moment. Soyez le premier à donner votre avis !
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}