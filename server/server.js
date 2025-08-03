const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();
app.use(cors());
app.use(express.json());

const cardRoutes = require("./routes/cards");
app.use("/api", cardRoutes);

// ----------------- Load MTG AtomicCards.json -----------------
const atomicPath = path.join(__dirname, "data", "AtomicCards.json");
if (!fs.existsSync(atomicPath)) {
  console.error("AtomicCards.json not found. Please add it to /server/data");
  process.exit(1);
}
const atomicData = JSON.parse(fs.readFileSync(atomicPath, "utf8"));
const cardMap = atomicData.data;

// ----------------- Mana Compression Utility -----------------
const compressMana = (manaArray) => {
  const counts = {};
  for (const mana of manaArray) {
    counts[mana] = (counts[mana] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([mana, count]) => (count > 1 ? `${count}${mana}` : mana))
    .join(" ");
};

// ----------------- Helper: Generate All Combos -----------------
const generateCombos = (arr, maxSize) => {
  const results = [];
  const helper = (start, combo) => {
    if (combo.length > 0) results.push([...combo]);
    if (combo.length === maxSize) return;
    for (let i = start; i < arr.length; i++) {
      combo.push(arr[i]);
      helper(i + 1, combo);
      combo.pop();
    }
  };
  helper(0, []);
  return results;
};

// ----------------- Helper: Get Mana Cost -----------------
const getManaCost = (cardName) => {
  const cardData = cardMap[cardName]?.[0];
  if (!cardData?.manaCost) return null;

  const costSymbols = cardData.manaCost.match(/{(.*?)}/g) || [];
  const cost = { generic: 0, colors: {} };

  for (const symbol of costSymbols) {
    const s = symbol.replace(/[{}]/g, "");
    if (/^\d+$/.test(s)) {
      cost.generic += parseInt(s);
    } else {
      cost.colors[s] = (cost.colors[s] || 0) + 1;
    }
  }
  return cost;
};

// ----------------- Helper: Pay Mana -----------------
const payMana = (cost, pool) => {
  const temp = { ...pool };
  const manaUsed = [];

  // Pay colored mana first
  for (const [color, count] of Object.entries(cost.colors)) {
    if ((temp[color] || 0) < count) return null;
    temp[color] -= count;
    for (let i = 0; i < count; i++) manaUsed.push(color);
  }

  // Pay generic mana using any remaining mana
  let genericRemaining = cost.generic;
  if (genericRemaining > 0) {
    const manaTypes = Object.keys(temp);
    for (const type of manaTypes) {
      while (temp[type] > 0 && genericRemaining > 0) {
        temp[type]--;
        genericRemaining--;
        manaUsed.push(type);
      }
    }
  }

  if (genericRemaining > 0) return null; // couldn't pay

  // Build remainingMana list
  const remainingMana = [];
  for (const [type, count] of Object.entries(temp)) {
    for (let i = 0; i < count; i++) remainingMana.push(type);
  }

  return { manaUsed, remainingMana };
};

// ----------------- POST /api/combo-castable -----------------
app.post("/api/combo-castable", (req, res) => {
  const { manaPool, hand } = req.body;

  if (!manaPool || !hand) {
    return res.status(400).json({ error: "Missing manaPool or hand" });
  }

  // Convert manaPool object (like {W:1, U:2}) to counts
  const poolCounts = { ...manaPool };

  // Generate combos up to 7 cards
  const allCombos = generateCombos(hand, 7);

  const validCombos = allCombos
    .map((combo) => {
      // Aggregate total mana cost of this combo
      const totalCost = { generic: 0, colors: {} };
      for (const cardName of combo) {
        const cost = getManaCost(cardName);
        if (!cost) return null;
        totalCost.generic += cost.generic;
        for (const [c, n] of Object.entries(cost.colors)) {
          totalCost.colors[c] = (totalCost.colors[c] || 0) + n;
        }
      }

      // Pay mana using the pool
      const payment = payMana(totalCost, poolCounts);
      if (!payment) return null;

      return {
        cards: combo,
        manaUsed: compressMana(payment.manaUsed),
        remainingMana: compressMana(payment.remainingMana),
      };
    })
    .filter(Boolean);

  res.json({ combos: validCombos });
});


// ----------------- START SERVER -----------------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
