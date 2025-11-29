"use client";

export default function ProjetsEnCoursPage() {
  /* IDs REELS issus de ta base */
  const IDS = {
    pascal: "692a3dc77be2252fe0996451",
    amina: "692a3dc77be2252fe099644d",
    samuel: "692a3dc77be2252fe099644e",
  };

  /* ============================
        PROJETS FICTIFS
  ============================= */
  const projets = [
    {
      auteur: "Pascal Ebong",
      id: IDS.pascal,
      ville: "Ebolowa (Sud)",
      titre: "Projet Arduino : faire parler les plantes 🌿🤖",
      description: `
Pascal souhaite apprendre Arduino pour créer un module permettant 
d'interpréter l'humidité et la lumière d’une plante, puis de convertir 
ces données en messages vocaux ou lumineux.

Recherche une personne maîtrisant Arduino pour collaboration.
      `,
      statut: "Recherche collaboration",
      couleur: "border-green-400",
    },

    {
      auteur: "Amina Njoh",
      id: IDS.amina,
      ville: "Bafoussam (Ouest)",
      titre: "Recherche apprentie / stagiaire — Grande commande de robes 👗✨",
      description: `
Amina a reçu une commande de 30 robes pour un mariage.

Recherche apprentie couturière disponible rapidement.
      `,
      statut: "Urgent",
      couleur: "border-orange-400",
    },

    {
      auteur: "Samuel Bikoko",
      id: IDS.samuel,
      ville: "Yaoundé (Centre)",
      titre: "Création d'un outil artisanal : le « Biko-Blade » 🪵🔧",
      description: `
Samuel développe un outil 3-en-1 pour sculpteurs : creuser, découper et polir.

Recherche métallier ou ferronnier pour prototype.
      `,
      statut: "Prototype en cours",
      couleur: "border-blue-400",
    },
  ];

  return (
    <div className="wrap py-12">
      <h1 className="text-3xl font-bold text-sawaka-700 text-center mb-6">
        Projets en cours dans la communauté Sawaka
      </h1>

      <div className="space-y-8">
        {projets.map((p, index) => (
          <div
            key={index}
            className={`bg-white border ${p.couleur} rounded-xl shadow-sm p-6`}
          >
            <h3 className="font-bold text-sawaka-800 text-lg">{p.auteur}</h3>
            <p className="text-sm text-sawaka-600 mb-3">{p.ville}</p>

            <h2 className="text-xl font-semibold text-sawaka-700 mb-3">
              {p.titre}
            </h2>

            <p className="text-sawaka-700 whitespace-pre-line mb-4">
              {p.description}
            </p>

            <span className="text-sm bg-cream-200 px-3 py-1 rounded-full">
              {p.statut}
            </span>

            {/* 🔗 Lien artisan — fonctionne maintenant */}
            <div className="mt-4">
              <a
                href={`/artisans/${p.id}`}
                className="text-sawaka-600 hover:text-sawaka-800 underline"
              >
                📩 Contacter l’artisan responsable
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
