const {authenticated, hasAccess} = require("../services/authentication");
const {getBoards, getCards, setBoards, setCards} = require("./tempStorage");
const express = require("express");
const router = express.Router();

router.use(authenticated);

router.get("/:boardId", async (req, res) => {
	const code = await hasAccess(req, getBoards());
	if (code !== 200) return res.sendStatus(code);

	const boardCards = getCards().filter(cur => cur.id === req.params.boardId);
	if (boardCards.length !== 1) res.sendStatus(404);

	res.send(boardCards[0]);
});

router.put("/:boardId/:cardId", async (req, res) => {
	const code = await hasAccess(req, getBoards());
	if (code !== 200) return res.sendStatus(code);

	const body = req.body;
	if (!body) return res.sendStatus(400);

	const boardId = req.params.boardId;
	const id = req.params.cardId;
	if (!id || !boardId) return res.sendStatus(401);

	setCards(getCards().map(cur => cur.id === boardId ? {...cur, cards: cur.cards.map(cur => cur.id === id ? body.card : cur)} : cur));

	res.sendStatus(200);
});

module.exports = router;