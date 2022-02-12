const {authenticated, hasAccess} = require("../services/authentication");
const {getCards, setCards, setBoards, getBoards} = require("./tempStorage");
const validateBody = require("./schemas/validateBody");
const validate = require("./schemas/card");
const express = require("express");

const router = express.Router();

router.use(authenticated);


router.get("/:boardId", hasAccess, (req, res) => {
	const {boardId} = req.params;

	const boardCards = getCards().filter(cur => cur.id === boardId);
	if (boardCards.length !== 1) res.sendStatus(404);

	res.send(boardCards[0]);
});

router.post("/", hasAccess, validateBody(validate.changeCard), (req, res) => {
	const {boardId, card} = req.body;

	setCards(getCards().map(cur => cur.id === boardId ? {...cur, cards: [...cur.cards, card]} : cur));

	res.sendStatus(200);
});

router.delete("/:boardId/:id", hasAccess, (req, res) => {
	const {boardId, id} = req.params;

	setCards(getCards().map(cur => cur.id === boardId ? {...cur, cards: cur.cards.filter(cur => cur.id !== id)} : cur));

	res.sendStatus(200);
});

router.put("/", hasAccess, validateBody(validate.changeCard), (req, res) => {
	const {card, boardId} = req.body;

	setCards(getCards().map(cur => cur.id === boardId ? {...cur, cards: cur.cards.map(cur => cur.id === card.id ? card : cur)} : cur));

	res.sendStatus(200);
});

module.exports = router;