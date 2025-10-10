"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ProduitDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  useEffect(() => {
    if (!id) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/seller/articles/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setArticle(data))
      .catch((err) => console.error("Erreur chargement article :", err));
  }, [id]);

  const handleLike = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/seller/articles/${id}/like`,
      { method: "POST", credentials: "include" }
    );
    const data = await res.json();
    setLiked(data.liked);
  };

  const handleComment = async () => {
    if (!comment) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/seller/articles/${id}/comment`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: comment, rating }),
    });
    setComment("");
    setRating(5);
    // Recharge l’article avec les commentaires à jour
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/seller/articles/${id}`);
    setArticle(await res.json());
  };

  if (!article) return <p className="p-10 text-center">Chargement...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <img
        src={article.images?.[0] || "/placeholder.png"}
        alt={article.title}
        className="w-full h-96 object-cover rounded-lg mb-6"
      />
      <h1 className="text-3xl font-bold mb-2 text-sawaka-800">{article.title}</h1>
      <p className="text-gray-600 mb-4">{article.description}</p>
      <p className="text-lg font-semibold mb-6 text-sawaka-700">
        {article.price?.toLocaleString()} FCFA
      </p>

      {/* ❤️ Like */}
      <button
        onClick={handleLike}
        className={`px-4 py-2 rounded-lg ${
          liked ? "bg-red-500 text-white" : "border border-red-500 text-red-500"
        }`}
      >
        {liked ? "❤️ Aimé" : "🤍 J'aime"} ({article.likes?.length || 0})
      </button>

      {/* 💬 Commentaires */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-3 text-sawaka-800">Commentaires</h3>

        {article.comments?.length > 0 ? (
          article.comments.map((c) => (
            <div key={c._id} className="border-b py-2">
              <strong>{c.user?.username || "Utilisateur"}</strong>
              <p>{c.text}</p>
              <span>⭐ {c.rating}</span>
            </div>
          ))
        ) : (
          <p>Aucun commentaire pour le moment.</p>
        )}

        {/* ✏️ Ajouter un commentaire */}
        <div className="mt-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Laissez un commentaire..."
            className="w-full border rounded-lg p-2"
          />
          <div className="flex items-center gap-2 mt-2">
            <label>Note :</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <button
              onClick={handleComment}
              className="bg-amber-700 text-white px-4 py-2 rounded-lg"
            >
              Publier
            </button>
          </div>
        </div>
      </div>

      {/* 📞 Contacter l’artisan */}
      {article.vendorId && (
        <a
          href={`/messages/nouveau?to=${article.vendorId}`}
          className="inline-block mt-6 bg-green-600 text-white px-6 py-3 rounded-lg"
        >
          Contacter l’artisan
        </a>
      )}
    </div>
  );
}
