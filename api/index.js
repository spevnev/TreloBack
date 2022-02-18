const board = require("./board");
const card = require("./card");
const user = require("./user");
const files = require("./files");
const auth = require("./auth");
const express = require("express");

const router = express.Router();

router.use("/file/", express.json({limit: "10mb"}), files);

router.use(express.json({limit: "1mb"}));

router.use("/board/", board);
router.use("/card/", card);
router.use("/user/", user);
router.use("/auth/", auth);

module.exports = router;