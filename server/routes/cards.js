const express = require("express");
const fs = require("fs");
const path = require("path");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const router = express.Router();

const atomicFile = path.join(__dirname, "../data/AtomicCards.json");
let cardMap = {};

async function updateAtomicCards() {
  console.log("Fetching latest AtomicCards.json from MTGJSON...");
  const response = await fetch("https://mtgjson.com/api/v5/AtomicCards.json");
  const json = await response.json();

  fs.writeFileSync(path.join(__dirname, "../data/AtomicCards.json"), JSON.stringify(json, null, 2));
  console.log("AtomicCards.json updated successfully!");
}


updateAtomicCards().catch((err) => console.error("Initial fetch error:", err));



// --- Ensure file exists or fetch it ---
if (!fs.existsSync(atomicFile)) {
  updateAtomicCards().catch((err) => console.error("Initial fetch error:", err));
}

// --- Safely load cache into memory ---
try {
  const raw = fs.readFileSync(atomicFile, "utf-8");
  cardMap = JSON.parse(raw);
} catch (err) {
  console.error("Failed to load AtomicCards.json from disk:", err);
  cardMap = {};
}

// --- Live search endpoint ---
router.get("/cards/search", (req, res) => {
  const q = (req.query.q || "").toLowerCase();
  const matches = Object.keys(cardMap)
    .filter((name) => name.toLowerCase().includes(q))
    .slice(0, 10);
  res.json({ cards: matches });
});

module.exports = router;
