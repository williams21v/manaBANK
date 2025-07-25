const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const comboFile = path.join(__dirname, "../data/combos.json");
let combos = [];

// --- Safe read of combos file ---
try {
  if (fs.existsSync(comboFile)) {
    const raw = fs.readFileSync(comboFile, "utf-8");
    combos = JSON.parse(raw);
  } else {
    console.warn("combos.json not found; starting with empty list");
    combos = [];
  }
} catch (err) {
  console.error("Failed to parse combos.json:", err);
  combos = [];
}

// --- Example endpoint ---
router.get("/combos", (req, res) => {
  res.json({ combos });
});

module.exports = router;
