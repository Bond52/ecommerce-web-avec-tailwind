// app/config/siteConfig.ts

export const siteConfig = {
  // ⚙️ Configuration du module "Nouveautés"
  nouveautes: {
    // Mode 1 : afficher les X derniers articles
    limit: 8,

    // Mode 2 : afficher tous les articles créés il y a moins de Y jours/heures
    recentDays: 7,
    recentHours: 0,

    // Si true, utilise la limite X ; sinon, utilise la période (Y jours/heures)
    useLimitMode: true,
  },
};
