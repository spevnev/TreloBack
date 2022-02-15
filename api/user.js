const {hash, verify} = require("../services/hash");
const {createJwt} = require("../services/jwt");
const {getUsers, setUsers, getBoards, setBoards, setCards, getCards} = require("./tempStorage");
const {isOwner, authenticated} = require("../services/authentication");
const validateBody = require("./schemas/validateBody");
const validate = require("./schemas/user");
const express = require("express");
const fs = require("fs");
const path = require("path");
const {randomUUID} = require("crypto");

const router = express.Router();


router.get("/", authenticated, async (req, res) => {
	const data = res.locals.data;
	const user = getUsers().filter(cur => cur.username === data.username)[0];
	if (!user) return res.send(["Invalid token - user doesn't exist!"]);

	res.send([null, {...user, password: undefined}]);
});

router.post("/signup", validateBody(validate.signup), async (req, res) => {
	const {username, password, icon} = req.body;

	if (getUsers().filter(cur => cur.username === username).length !== 0) return res.send(["This username is already taken!"]);

	const id = randomUUID();
	const fileDir = path.join(__dirname, "../public/icons");
	await fs.promises.stat(fileDir).catch(async () => await fs.promises.mkdir(fileDir));
	await fs.promises.writeFile(path.join(fileDir, `${id}.${icon.ext}`), icon.data.replace(/^data:image\/[a-z]+;base64,/, ""), "base64").catch(e => {
		if (!res.headersSent) res.send([e]);
	});

	const user = {username, icon: {id, ext: icon.ext}};
	setUsers([...getUsers(), {...user, password: await hash(password), boards: []}]);

	if (!res.headersSent) res.send([null, {token: await createJwt({username}), user}]);
});

router.post("/login", validateBody(validate.login), async (req, res) => {
	const {username, password} = req.body;

	if (getUsers().filter(cur => cur.username === username).length === 0) return res.sendStatus(400);

	const user = getUsers().filter(cur => cur.username === username);
	if (user.length !== 1) return res.send(["Invalid username or password"]);

	if (!await verify(password, user[0].password)) return res.send(["Invalid username or password"]);

	res.send([null, {token: await createJwt({username}), user: {username, icon: user[0].icon}}]);
});

router.post("/addBoard", validateBody(validate.addBoard), authenticated, isOwner, async (req, res) => {
	const {boardId, username} = req.body;

	const board = getBoards().filter(cur => cur.id === boardId)[0];

	let user = null;
	setUsers(getUsers().map(cur => {
		if (cur.username !== username) return cur;
		user = cur;
		return {...cur, boards: [...cur.boards, {title: board.title, id: board.id, isFavourite: false, isOwner: false}]};
	}));

	if (user === null) return res.send(["Invalid username!"]);
	res.send([null, {...user, password: undefined, boards: undefined}]);
});

router.post("/deleteBoard", validateBody(validate.deleteBoard), authenticated, isOwner, async (req, res) => {
	const {username, boardId} = req.body;

	setUsers(getUsers().map(cur => cur.username === username ? {...cur, boards: cur.boards.filter(cur => cur.id !== boardId)} : cur));
	setCards(getCards().map(cur => cur.id === boardId ? {
		...cur,
		cards: cur.cards.map(cur => ({...cur, assigned: cur.assigned.filter(cur => cur.username !== username)})),
	} : cur));

	res.sendStatus(200);
});

router.post("/role", validateBody(validate.changeRole), authenticated, isOwner, async (req, res) => {
	const {username, isOwner, boardId} = req.body;

	setUsers(getUsers().map(cur => cur.username === username ? {...cur, boards: cur.boards.map(cur => cur.id === boardId ? {...cur, isOwner} : cur)} : cur));

	res.sendStatus(200);
});

router.post("/leave", authenticated, async (req, res) => {
	const data = res.locals.data;
	const {boardId} = req.body;
	if (!boardId) return res.sendStatus(400);

	setUsers(getUsers().map(cur => cur.username === data.username ? {...cur, boards: cur.boards.filter(cur => cur.id !== boardId)} : cur));
	setBoards(getBoards().map(cur => cur.id === boardId ? {...cur, users: cur.users.filter(cur => cur.username !== data.username)} : cur));
	setCards(getCards().map(cur => cur.id === boardId ? {
		...cur,
		cards: cur.cards.map(cur => ({...cur, assigned: cur.assigned.filter(cur => cur.username !== data.username)})),
	} : cur));

	res.sendStatus(200);
});

router.put("/", validateBody(validate.changeBoards), authenticated, async (req, res) => {
	const data = res.locals.data;
	const boards = req.body.boards;

	setUsers(getUsers().map(cur => cur.username === data.username ? {...cur, boards} : cur));

	res.sendStatus(200);
});

module.exports = router;