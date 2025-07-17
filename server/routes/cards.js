const express = require("express");
const router = express.Router();
const { getPlayableCards } = require("../controllers/manaController")

router.post("/playable-cards", getPlayableCards);

module.exports = router;