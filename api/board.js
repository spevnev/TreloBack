const {authenticated, hasAccess, isOwner} = require("../services/authentication");
const {getBoards, setBoards, setCards, getCards, setUsers, getUsers} = require("./tempStorage");
const express = require("express");

const router = express.Router();
router.use(authenticated);


router.get("/:boardId", hasAccess, async (req, res) => {
	const {boardId} = req.params;
	if (!boardId) return res.sendStatus(400);

	const board = getBoards().filter(cur => cur.id === boardId);
	if (board.length !== 1) return res.sendStatus(404);

	res.send(board[0]);
});

router.post("/", async (req, res) => {
	const data = res.locals.data;
	const {board} = req.body;
	if (!board) return res.sendStatus(400);

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

router.put("/:boardId", isOwner, async (req, res) => {
	const {board} = req.body;
	const {boardId} = req.params;
	if (!boardId || !board) return res.sendStatus(400);

	setBoards(getBoards().map(cur => cur.id === boardId ? board : cur));

	res.sendStatus(200);
});

router.delete("/:boardId", isOwner, async (req, res) => {
	const {boardId} = req.params;
	if (!boardId) return res.sendStatus(400);

	const newBoards = getBoards().filter(cur => cur.id !== boardId);
	if (newBoards.length === getBoards().length) res.sendStatus(404);

	setBoards(newBoards);

	res.sendStatus(200);
});

module.exports = router;