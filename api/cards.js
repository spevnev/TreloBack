const {authenticated, hasAccess} = require("../services/authentication");
const {getCards, setCards} = require("./tempStorage");
const express = require("express");

const router = express.Router();
router.use(authenticated);


router.get("/:boardId", hasAccess, async (req, res) => {
	const {boardId} = req.params;
	if (!boardId) return res.sendStatus(400);

	const boardCards = getCards().filter(cur => cur.id === boardId);
	if (boardCards.length !== 1) res.sendStatus(404);

	res.send(boardCards[0]);
});

router.put("/:boardId/:cardId", hasAccess, async (req, res) => {
	const {card} = req.body;
	const {boardId, cardId} = req.params;
	if (!card || !cardId || !boardId) return res.sendStatus(400);

	setCards(getCards().map(cur => cur.id === boardId ? {...cur, cards: cur.cards.map(cur => cur.id === cardId ? card : cur)} : cur));

	res.sendStatus(200);
});

module.exports = router;