const express = require("express");
const board = require("./board");
const cards = require("./cards");
const router = express.Router();

router.use("/board/", board);
router.use("/cards/", cards);

module.exports = router;