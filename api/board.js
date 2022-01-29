const {authenticated, hasAccess, isOwner} = require("../services/authentication");
const express = require("express");
const router = express.Router();

let boards = [{
	title: "Board 1", isFavourite: false, id: "1",
	users: [{username: "Username 1", userIcon: "https://www.manufacturingusa.com/sites/manufacturingusa.com/files/default.png", isOwner: true},
		{username: "Username 2", userIcon: "https://www.manufacturingusa.com/sites/manufacturingusa.com/files/default.png", isOwner: false}],
	lists: [{title: "First list", id: "1"}, {title: "List", id: "2"}],
}, {
	title: "Board 2", isFavourite: false, id: "2", status: "READY",
	users: [{username: "Username 1", userIcon: "https://www.manufacturingusa.com/sites/manufacturingusa.com/files/default.png", isOwner: false},
		{username: "Username 2", userIcon: "https://www.manufacturingusa.com/sites/manufacturingusa.com/files/default.png", isOwner: true}],
	lists: [{title: "First list", id: "1"}, {title: "List", id: "2"}],
}];

const getBoard = id => {
	const board = boards.filter(cur => cur.id === id);
	if (board.length === 1) return board[0];

	return null;
};

router.use(authenticated);

router.get("/:boardId", async (req, res) => {
	const code = await hasAccess(req, boards);
	if (code !== 200) return res.sendStatus(code);

	const board = getBoard(req.params.boardId);
	if (board === null) return res.sendStatus(404);

	res.send(board);
});

router.delete("/:boardId", async (req, res) => {
	const code = await isOwner(req, boards);
	if (code !== 200) return res.sendStatus(code);

	const newBoards = boards.filter(cur => cur.id !== req.params.boardId);
	if (newBoards.length === boards.length) res.sendStatus(404);

	boards = newBoards;
	res.sendStatus(200);
});

router.patch("/:boardId", async (req, res) => {
	const code = await isOwner(req, boards);
	if (code !== 200) return res.sendStatus(code);

	const board = getBoard(req.params.boardId);
	if (board === null) return res.sendStatus(404);

	//TODO

	res.sendStatus(200);
});

module.exports = router;