const {authenticated, hasAccess, isOwner} = require("../services/authentication");
const express = require("express");
const router = express.Router();
const {getBoards, setBoards} = require("./tempStorage");

const getBoard = id => {
	const board = getBoards().filter(cur => cur.id === id);
	if (board.length === 1) return board[0];

	return null;
};

router.use(authenticated);

router.get("/:boardId", async (req, res) => {
	const code = await hasAccess(req, getBoards());
	if (code !== 200) return res.sendStatus(code);

	const board = getBoard(req.params.boardId);
	if (board === null) return res.sendStatus(404);

	res.send(board);
});

router.delete("/:boardId", async (req, res) => {
	const code = await isOwner(req, getBoards());
	if (code !== 200) return res.sendStatus(code);

	const newBoards = getBoards().filter(cur => cur.id !== req.params.boardId);
	if (newBoards.length === getBoards().length) res.sendStatus(404);

	setBoards(newBoards);
	res.sendStatus(200);
});

router.patch("/:boardId", async (req, res) => {
	const code = await isOwner(req, getBoards());
	if (code !== 200) return res.sendStatus(code);

	const board = getBoard(req.params.boardId);
	if (board === null) return res.sendStatus(404);

	res.sendStatus(200);
});

module.exports = router;