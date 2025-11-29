"use client";

export default function ProjetsEnCoursPage() {
  const projets = [
    {
      auteur: "Pascal Ebong",
      ville: "Ebolowa",
      titre: "Projet Arduino : faire parler les plantes 🌿🤖",
      description: `
Pascal souhaite apprendre Arduino pour créer un module permettant 
d'interpréter l'humidité et la lumière d’une plante, puis de convertir 
ces données en petits messages vocaux ou lumineux.

🎯 Objectifs :
• Apprendre Arduino (bases)
• Capteur d'humidité + luminosité
• Ajouter un mini-haut-parleur ou LED

👥 Recherche une personne maîtrisant Arduino pour collaboration.
      `,
      statut: "Recherche collaboration",
      couleur: "border-green-400",
    },

    {
      auteur: "Amina Njoh",
      ville: "Yaoundé",
      titre: "Recherche apprentie / stagiaire — Grande commande de robes 👗✨",
      description: `
Amina a reçu une très grande commande : plus de 30 robes traditionnelles 
et modernes pour un mariage prestigieux.

🎯 Recherche :
• Apprentie couturière motivée
• Disponible 2 à 3 semaines
• Notions de patronnage (bonus)

💼 Travail rémunéré et possibilité d’une collaboration longue.
      `,
      statut: "Urgent — Recrutement en cours",
      couleur: "border-orange-400",
    },

    {
      auteur: "Samuel Bikoko",
      ville: "Bafoussam",
      titre: "Création d'un outil artisanal : le « Biko-Blade » 🪵🔧",
      description: `
Samuel développe un outil 3-en-1 pour sculpteurs : le « Biko-Blade ».
Il permettrait de :
• creuser le bois,
• découper avec précision,
• polir et lisser les finitions.

Un outil polyvalent pensé pour les artisans du Cameroun.

👥 Recherche un métallier ou ferronnier pour réaliser un prototype.
      `,
      statut: "Prototype en cours",
      couleur: "border-blue-400",
    },
  ];

  return (
    <div className="wrap py-12">
      {/* TITRE */}
      <h1 className="text-3xl font-bold text-sawaka-700 text-center mb-6">
        Projets en cours dans la communauté Sawaka
      </h1>

      <p className="text-center text-sawaka-600 max-w-2xl mx-auto mb-10">
        Découvrez les projets créatifs, les besoins de collaboration et les ateliers en développement.
      </p>

      {/* LISTE DES PROJETS — VERTICALE */}
      <div className="space-y-8">
        {projets.map((p, index) => (
          <div
            key={index}
            className={`bg-white border ${p.couleur} rounded-xl shadow-sm p-6`}
          >
            {/* AUTEUR */}
            <div className="mb-4">
              <h3 className="font-bold text-sawaka-800 text-lg">
                {p.auteur}
              </h3>
              <p className="text-sm text-sawaka-600">{p.ville}</p>
            </div>

            {/* TITRE */}
            <h2 className="text-xl font-semibold text-sawaka-700 mb-3">
              {p.titre}
            </h2>

            {/* DESCRIPTION */}
            <p className="text-sawaka-700 whitespace-pre-line leading-relaxed mb-4">
              {p.description}
            </p>

            {/* STATUT */}
            <div className="text-sm font-semibold text-sawaka-700 bg-cream-200 px-3 py-1 rounded-full inline-block">
              {p.statut}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
