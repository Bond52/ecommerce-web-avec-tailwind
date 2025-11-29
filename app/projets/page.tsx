"use client";

export default function ProjetsEnCoursPage() {
  const projets = [
    {
      auteur: "Pascal Ebong",
      ville: "Ebolowa",
      avatar: "/images/artisans/pascal.jpg", // ou ton avatar actuel
      titre: "Projet Arduino : faire parler les plantes 🌿🤖",
      description: `
        Pascal souhaite apprendre à utiliser Arduino pour créer un petit module capable 
        d’interpréter l’humidité et l’exposition lumineuse des plantes, puis de transformer 
        ces données en petits messages vocaux ou lumineux.
        
        🎯 Objectif :
        - Comprendre les bases d'Arduino
        - Créer un capteur d'humidité + lumière
        - Ajouter un mini-haut-parleur pour générer des sons
        
        👥 Pascal recherche quelqu’un maîtrisant Arduino pour l’accompagner.
      `,
      statut: "Recherche collaboration",
      couleur: "border-green-400",
    },

    {
      auteur: "Amina Njoh",
      ville: "Yaoundé",
      avatar: "/images/artisans/amina.jpg",
      titre: "Recherche apprentie / stagiaire couture — Commande spéciale mariage 👗✨",
      description: `
        Amina vient de recevoir une très grande commande : 
        plus de 30 robes traditionnelles et modernes pour un mariage royal.

        🎯 Ce qu’elle recherche :
        - Une couturière ou apprentie motivée
        - Quelqu’un disponible au moins 3 semaines
        - Notions de patronnage (bonus)
        
        💼 Travail rémunéré + possibilité de collaboration future.
      `,
      statut: "Urgent — Recrutement en cours",
      couleur: "border-orange-400",
    },

    {
      auteur: "Samuel Bikoko",
      ville: "Bafoussam",
      avatar: "/images/artisans/samuel.jpg",
      titre: "Création d'un outil de sculpture multi-usage : le « Biko-Blade » 🪵🔧",
      description: `
        Samuel travaille sur un outil artisanal innovant : 
        une lame hybride permettant à la fois de :
        - creuser le bois,
        - réaliser des motifs en arrondi,
        - lisser et poncer finement.

        🛠 Le « Biko-Blade » serait un outil 3-en-1 pour les sculpteurs du Cameroun.

        👥 Recherche :
        - Métallier ou ferronnier
        - Connaissance en affûtage ou fabrications d’outils
      `,
      statut: "Prototype en cours",
      couleur: "border-blue-400",
    },
  ];

  return (
    <div className="wrap py-12">
      <h1 className="text-3xl font-bold text-sawaka-700 mb-6 text-center">
        Projets en cours de la communauté Sawaka
      </h1>

      <p className="text-center text-sawaka-600 max-w-2xl mx-auto mb-12">
        Découvrez les projets personnels, collaborations et ateliers lancés par les artisans du réseau.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projets.map((p, index) => (
          <div
            key={index}
            className={`bg-white border ${p.couleur} rounded-xl shadow-sm p-6 hover:shadow-md transition`}
          >
            {/* HEADER */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-cream-100 overflow-hidden">
                <img
                  src={p.avatar}
                  alt={p.auteur}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h3 className="font-bold text-sawaka-800">{p.auteur}</h3>
                <p className="text-sm text-sawaka-600">{p.ville}</p>
              </div>
            </div>

            {/* TITRE */}
            <h2 className="text-xl font-semibold text-sawaka-700 mb-2">
              {p.titre}
            </h2>

            {/* DESCRIPTION */}
            <p className="text-sawaka-600 whitespace-pre-line text-sm mb-4">
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
