const path = require("path");
const fs = require("fs");
const { canCast } = require("../utils/manaCostUtil");

//Load the simplified AtomicCards.json once on server startup
const cardsPath = path.resolve(__dirname, "../../data/AtomicCards.json");
const cardData = JSON.parse(fs.readFileSync(cardsPath, "utf8"));

//Build a quick lookup map by name
const cardMap = {};
for (const card of cardData) {
    if (card.name && card.manaCost) {
        cardMap[card.name.toLowerCase()] = card;
    }
}

const getPlayableCards = (req, res) => {
    const { manaPool, hand } = req.body;

    if (!manaPool || !hand) {
        return res.status(400).json({ error: "manaPool and hand are required" })
    }

    const playable = [];

    for (const cardName of hand) {
        const card = cardMap[cardName.toLowerCase()];
        if (!card) continue;

        const cost = card.manaCost;
        if (canCast(cost, manaPool)) {
            playable.push(card.name);
        }
    }
    res.json({ playable });
};

module.exports = { getPlayableCards}