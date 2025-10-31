const Article = require("../models/Article");

async function closeExpiredAuctions() {
  const now = new Date();
  const articles = await Article.find({
    "auction.isActive": true,
    "auction.endDate": { $lte: now },
  });

  for (const a of articles) {
    a.auction.isActive = false;
    a.status = "draft"; // ou "published" si tu veux qu’il reste visible
    await a.save();
  }

  console.log(`✅ ${articles.length} enchère(s) clôturée(s).`);
}

module.exports = closeExpiredAuctions;
