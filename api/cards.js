const {authenticated, hasAccess} = require("../services/authentication");
const {boards, cards} = require("./tempStorage");
const express = require("express");
const router = express.Router();

router.use(authenticated);

router.get("/:boardId", async (req, res) => {
	const code = await hasAccess(req, boards);
	if (code !== 200) return res.sendStatus(code);

	const boardCards = cards.filter(cur => cur.id === req.params.boardId);
	if (boardCards.length !== 1) res.sendStatus(404);

	res.send(boardCards[0]);
});

module.exports = router;