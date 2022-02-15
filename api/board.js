const {authenticated, hasAccess, isOwner} = require("../services/authentication");
const {getBoards, setBoards, setCards, getCards, setUsers, getUsers} = require("./tempStorage");
const validateBody = require("./schemas/validateBody");
const validate = require("./schemas/board");
const express = require("express");

const router = express.Router();

router.use(authenticated);

router.get("/:boardId", hasAccess, async (req, res) => {
	const {boardId} = req.params;

	const board = getBoards().filter(cur => cur.id === boardId);
	if (board.length !== 1) return res.sendStatus(404);

	res.send(board[0]);
});

router.post("/", validateBody(validate.createBoard), async (req, res) => {
	const {board} = req.body;
	const data = res.locals.data;

	const boards = getBoards();
	if (boards.filter(cur => cur.id === board.id).length === 1) return res.sendStatus(400);

	setBoards([...boards, board]);
	setCards([...getCards(), {id: board.id, cards: []}]);
	setUsers(getUsers().map(cur => cur.username === data.username ? {
		...cur,
		boards: [...cur.boards, {id: board.id, isFavourite: false, isOwner: true, title: board.title}],
	} : cur));

	res.sendStatus(200);
});

router.put("/", isOwner, validateBody(validate.changeBoard), async (req, res) => {
	const {board, boardId} = req.body;

	setBoards(getBoards().map(cur => cur.id === boardId ? board : cur));

	res.sendStatus(200);
});

router.delete("/:boardId", isOwner, async (req, res) => {
	const {boardId} = req.params;

	const newBoards = getBoards().filter(cur => cur.id !== boardId);
	if (newBoards.length === getBoards().length) res.sendStatus(404);

	setBoards(newBoards);
	setUsers(getUsers().map(cur => ({...cur, boards: cur.boards.filter(cur => cur.id !== boardId)})));

	res.sendStatus(200);
});

module.exports = router;