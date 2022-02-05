const express = require("express");
const {hash, verify} = require("../services/hash");
const {createJwt, verifyJwt} = require("../services/jwt");
const {getUsers, setUsers, getBoards, setBoards} = require("./tempStorage");
const {isOwner} = require("../services/authentication");
const router = express.Router();

const validate = (name, pass) => name && pass && name.length >= 4 && pass.length >= 4;

//TODO:  TEMP
hash("test").then(test => {
	hash("temp").then(password => setUsers([{username: "test", password: test, boards: [{id: "1", title: "poh", isOwner: true, isFavourite: false}]}, {
		username: "temp",
		password,
		boards: [],
	}]));
});

router.get("/", async (req, res) => {
	const token = req.headers.authorization;
	if (!token || !token.startsWith("Bearer ")) return res.sendStatus(401);

	const [error, data] = await verifyJwt(token.split("Bearer ")[1]);
	if (error) return res.status(401).send(error);

	const user = getUsers().filter(cur => cur.username === data.username)[0];
	res.send({...user, userIcon: undefined, password: undefined}); //TODO: remove userIcon: undefined
});

// router.get("/:username", (req, res) => {
// 	const username = req.params.username;
// 	if (!username) return res.sendStatus(400);
//
// 	const user = getUsers().filter(cur => cur.username === username);
// 	if (user.length === 0) return res.send(["User with this username doesn't exist!"]);
//
// 	res.send([null, {...user[0], password: undefined}]);
// });

router.post("/signup", async (req, res) => {
	const {username, password, userIcon} = req.body;
	if (!validate(username, password)) return res.sendStatus(400);
	if (getUsers().filter(cur => cur.username === username).length !== 0) return res.send(["This username is already taken!"]);

	const user = {username, userIcon};
	getUsers().push({...user, password: await hash(password), boards: []});

	res.send([null, {token: await createJwt({username}), user}]);
});

router.post("/login", async (req, res) => {
	const {username, password} = req.body;
	if (!validate(username, password) || getUsers().filter(cur => cur.username === username).length === 0) return res.send(["Error"]);

	const user = getUsers().filter(cur => cur.username === username);
	if (user.length !== 1) return res.send([false, null]);

	if (!await verify(password, user[0].password)) return res.send([false, null]);

	res.send([null, {token: await createJwt({username}), user: {username, userIcon: user[0].userIcon}}]);
});

router.put("/", async (req, res) => {
	const token = req.headers.authorization;
	if (!token || !token.startsWith("Bearer ")) return res.sendStatus(401);

	const [error, data] = await verifyJwt(token.split("Bearer ")[1]);
	if (error) return res.status(401).send(error);

	const boards = req.body.boards;
	if (!boards) return res.sendStatus(400);

	setUsers(getUsers().map(cur => cur.username === data.username ? {...cur, boards} : cur));

	res.sendStatus(200);
});

router.post("/", async (req, res) => {
	const body = req.body;
	if (!body) return res.status(400).send(["Error"]);

	const code = await isOwner(req, body.boardId);
	if (code !== 200) return res.status(code).send(["Error"]);

	const board = getBoards().filter(cur => cur.id === body.boardId)[0];

	let user = null;
	setUsers(getUsers().map(cur => {
		if (cur.username !== body.username) return cur;
		user = cur;
		return {...cur, boards: [...cur.boards, {title: board.title, id: board.id, isFavourite: false, isOwner: false}]};
	}));

	if (user === null) res.status(404).send(["Error"]);
	res.send([null, {...user[0], password: undefined}]);
});

router.delete("/", async (req, res) => {
	const body = req.body;
	if (!body) return res.sendStatus(400);

	const code = await isOwner(req, body.boardId);
	if (code !== 200) return res.sendStatus(code);

	setUsers(getUsers().map(cur => cur.username === body.username ? {...cur, boards: cur.boards.filter(cur => cur.id !== body.boardId)} : cur));

	res.sendStatus(200);
});

module.exports = router;