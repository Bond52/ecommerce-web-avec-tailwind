"use client";
import { useState } from "react";

export default function AmeliorationPage() {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  const handleSend = async () => {
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, email }),
    });

    const data = await res.json();
    if (data.success) alert("Merci pour votre retour !");
    else alert("Erreur lors de l’envoi");
  };

  return (
    <div className="wrap py-12">
      <h1 className="text-3xl font-bold mb-4">Améliorer Sawaka</h1>
      <p className="text-sawaka-700 mb-6">
        Sawaka est en phase de test. Donnez-nous vos idées, remarques ou bugs rencontrés !
      </p>

      <input
        type="email"
        placeholder="Votre email (optionnel)"
        className="border w-full p-3 mb-4 rounded-lg"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <textarea
        placeholder="Votre message..."
        className="border w-full p-4 h-40 rounded-lg"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        onClick={handleSend}
        className="mt-4 bg-sawaka-600 text-white px-6 py-3 rounded-lg"
      >
        Envoyer
      </button>
    </div>
  );
}
