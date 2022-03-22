const {authenticated, hasAccess, isOwner} = require("../services/authentication");
const validateBody = require("./schemas/validateBody");
const validate = require("./schemas/board");
const boardDB = require("../db/board");
const express = require("express");
const {publish} = require("../redis/pubSub");

const router = express.Router();

router.use(authenticated);


router.get("/:boardId", hasAccess, (req, res) => res.send(res.locals.board));

router.post("/", validateBody(validate.createBoard), async (req, res) => {
	const {title, boardId} = req.body;

	if (!(await boardDB.addBoard(title, boardId, res.locals.user.username))) return res.sendStatus(400);
	res.sendStatus(200);
});

router.post("/user", isOwner, validateBody(validate.addUser), async (req, res) => {
	const {username, boardId} = req.body;

	const [error, user] = await boardDB.addUser(res.locals.board, username);

	res.send([error, user]);
	if (!error) await publish(boardId, res.locals.socketId, "board:addUser", {boardId, user});
});

router.post("/list", isOwner, validateBody(validate.addList), async (req, res) => {
	const {boardId, list} = req.body;

	if (!(await boardDB.addList(boardId, list))) return res.sendStatus(400);

	res.sendStatus(200);
	await publish(boardId, res.locals.socketId, "board:addList", {boardId, list});
});

router.put("/list", isOwner, validateBody(validate.changeList), async (req, res) => {
	const {list, boardId} = req.body;

	if (!(await boardDB.changeList(list))) return res.sendStatus(400);

	res.sendStatus(200);
	await publish(boardId, res.locals.socketId, "board:changeList", {boardId, list});
});

router.put("/user", isOwner, validateBody(validate.changeUser), async (req, res) => {
	const {username, isOwner, boardId} = req.body;

	if (!(await boardDB.changeUser(boardId, username, isOwner))) return res.sendStatus(400);

	res.sendStatus(200);
	await publish(boardId, res.locals.socketId, "board:changeUser", {boardId, username, isOwner});
});

router.put("/", isOwner, validateBody(validate.changeBoard), async (req, res) => {
	const {title, boardId} = req.body;

	if (!(await boardDB.changeBoard(boardId, title))) return res.sendStatus(400);

	res.sendStatus(200);
	await publish(boardId, res.locals.socketId, "board:change", {boardId, title});
});

router.delete("/:boardId", isOwner, async (req, res) => {
	const {boardId} = req.params;

	if (!(await boardDB.deleteBoard(boardId))) return res.sendStatus(400);

	res.sendStatus(200);
	await publish(boardId, res.locals.socketId, "board:delete", boardId);
});

router.delete("/list/:boardId/:id", isOwner, async (req, res) => {
	const {boardId, id} = req.params;

	if (!(await boardDB.deleteList(boardId, id))) return res.sendStatus(400);

	res.sendStatus(200);
	await publish(boardId, res.locals.socketId, "board:deleteList", {boardId, id});
});

router.delete("/user/:boardId/:username", isOwner, async (req, res) => {
	const {username, boardId} = req.params;

	if (!(await boardDB.deleteUser(boardId, username))) return res.sendStatus(400);

	res.sendStatus(200);
	await publish(boardId, res.locals.socketId, "board:deleteUser", {boardId, username});
});


module.exports = router;