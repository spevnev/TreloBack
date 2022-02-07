const {authenticated, hasAccess} = require("../services/authentication");
const {getCards, setCards} = require("./tempStorage");
const validateBody = require("./schemas/validateBody");
const validate = require("./schemas/card");
const express = require("express");

const router = express.Router();

router.use(authenticated);


router.get("/:boardId", hasAccess, async (req, res) => {
	const {boardId} = req.params;

	const boardCards = getCards().filter(cur => cur.id === boardId);
	if (boardCards.length !== 1) res.sendStatus(404);

	res.send(boardCards[0]);
});

router.put("/", hasAccess, validateBody(validate.changeCard), async (req, res) => {
	const {card, boardId} = req.body;

	setCards(getCards().map(cur => cur.id === boardId ? {...cur, cards: cur.cards.map(cur => cur.id === card.id ? card : cur)} : cur));

	res.sendStatus(200);
});

module.exports = router;