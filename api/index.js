const express = require("express");
const board = require("./board");
const card = require("./card");
const user = require("./user");
const router = express.Router();

router.use("/board/", board);
router.use("/card/", card);
router.use("/user/", user);

module.exports = router;