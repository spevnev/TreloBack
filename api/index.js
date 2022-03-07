const express = require("express");

const router = express.Router();


router.use("/file/", express.json({limit: "100mb"}), require("./files"));


router.use(express.json({limit: "10mb"}));

router.use("/board/", require("./board"));
router.use("/card/", require("./card"));
router.use("/user/", require("./user"));
router.use("/auth/", require("./auth"));


module.exports = router;