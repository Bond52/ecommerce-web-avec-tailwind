/**
 * 🎨 Récupère les artisans (avec filtre optionnel par ville)
 */
router.get("/", async (req, res) => {
  try {
    const { city } = req.query;

    // Conditions de base : vendeur ou role "vendeur"
    const filter = {
      $or: [{ isSeller: true }, { roles: { $in: ["vendeur"] } }]
    };

    // Si ?city= est fourni → ajouter filtre
    if (city) {
      filter.city = {
        $regex: new RegExp(`^${city}$`, "i")  // insensible à la casse
      };
    }

    const artisans = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(artisans);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors du chargement des artisans" });
  }
});
