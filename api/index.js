const express = require("express");
const board = require("./board");
const cards = require("./cards");
const user = require("./user");
const router = express.Router();

router.use("/board/", board);
router.use("/cards/", cards);
router.use("/user/", user);

module.exports = router;