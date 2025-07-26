const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// Load AtomicCards.json once at startup
const cardsPath = path.join(__dirname, "../data/AtomicCards.json");
const raw = fs.readFileSync(cardsPath, "utf8");
const cardData = JSON.parse(raw);

// cardData.data is an object keyed by card name
const allCardNames = Object.keys(cardData.data || {});

// --- Live search route ---
router.get("/cards/search", (req, res) => {
  const q = (req.query.q || "").toLowerCase();
  const matches = allCardNames
    .filter((name) => name.toLowerCase().includes(q))
    .slice(0, 10);

  res.json({ cards: matches });
});

module.exports = router;
