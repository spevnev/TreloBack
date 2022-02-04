const {authenticated, hasAccess, isOwner} = require("../services/authentication");
const express = require("express");
const router = express.Router();
const {getBoards, setBoards, setCards, getCards} = require("./tempStorage");

router.use(authenticated);

router.get("/:boardId", async (req, res) => {
	const code = await hasAccess(req, getBoards());
	if (code !== 200) return res.sendStatus(code);

	const board = getBoards().filter(cur => cur.id === req.params.boardId);
	if (board.length !== 1) return res.sendStatus(404);

	res.send(board[0]);
});

router.delete("/:boardId", async (req, res) => {
	const code = await isOwner(req, getBoards());
	if (code !== 200) return res.sendStatus(code);

	const newBoards = getBoards().filter(cur => cur.id !== req.params.boardId);
	if (newBoards.length === getBoards().length) res.sendStatus(404);

	setBoards(newBoards);

	res.sendStatus(200);
});

router.put("/:boardId", async (req, res) => {
	const code = await isOwner(req, getBoards());
	if (code !== 200) return res.sendStatus(code);

	const body = req.body;
	if (!body) return res.sendStatus(400);

	const id = req.params.boardId;
	if (id === null) return res.sendStatus(401);

	setBoards(getBoards().map(cur => cur.id === id ? body.board : cur));

	res.sendStatus(200);
});

router.post("/", async (req, res) => {
	const body = req.body;
	if (!body) return res.sendStatus(400);

	const boards = getBoards();
	if (boards.filter(cur => cur.id === body.board.id).length === 1) return res.sendStatus(400);

	setBoards([...boards, body.board]);
	setCards([...getCards(), {id: body.board.id, cards: []}]);

	res.sendStatus(200);
});

module.exports = router;