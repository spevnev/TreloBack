const {hash, verify} = require("../services/hash");
const {createJwt} = require("../services/jwt");
const {getUsers, setUsers, getBoards, setBoards, setCards, getCards} = require("./tempStorage");
const {isOwner, authenticated} = require("../services/authentication");
const validateBody = require("./schemas/validateBody");
const validate = require("./schemas/user");
const express = require("express");

const router = express.Router();


//TODO:  TEMP
hash("test").then(test => {
	hash("temp").then(password => setUsers([{username: "test", password: test, boards: [{id: "1", title: "poh", isOwner: true, isFavourite: false}]}, {
		username: "temp",
		password,
		boards: [],
	}]));
});


router.get("/", authenticated, async (req, res) => {
	const data = res.locals.data;
	const user = getUsers().filter(cur => cur.username === data.username)[0];

	res.send({...user, userIcon: undefined, password: undefined}); //TODO: remove userIcon: undefined
});

router.post("/signup", validateBody(validate.signup), async (req, res) => {
	const {username, password, userIcon} = req.body;

	if (getUsers().filter(cur => cur.username === username).length !== 0) return res.send(["This username is already taken!"]);

	const user = {username, userIcon};
	setUsers([...getUsers(), {...user, password: await hash(password), boards: []}]);

	res.send([null, {token: await createJwt({username}), user}]);
});

router.post("/login", validateBody(validate.login), async (req, res) => {
	const {username, password} = req.body;

	if (getUsers().filter(cur => cur.username === username).length === 0) return res.sendStatus(400);

	const user = getUsers().filter(cur => cur.username === username);
	if (user.length !== 1) return res.send(["Invalid username or password"]);

	if (!await verify(password, user[0].password)) return res.send(["Invalid username or password"]);

	res.send([null, {token: await createJwt({username}), user: {username, userIcon: user[0].userIcon}}]);
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

	if (user === null || user.length === 0) return res.send(["Invalid username!"]);
	res.send([null, {...user[0], password: undefined}]);
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