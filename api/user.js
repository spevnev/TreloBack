const express = require("express");
const {hash, verify} = require("../services/hash");
const {createJwt, verifyJwt} = require("../services/jwt");
const {getUsers, setUsers} = require("./tempStorage");
const router = express.Router();

const validate = (name, pass) => name && pass && name.length >= 4 && pass.length >= 4;

// -~=TEMP=~-
hash("test").then(password => setUsers([{username: "test", password}]));

router.get("/", async (req, res) => {
	const token = req.headers.authorization;
	if (!token || !token.startsWith("Bearer ")) return res.sendStatus(401);

	const [valid, data] = await verifyJwt(token.split("Bearer ")[1]);
	if (!valid) return res.status(401).send(data);

	const user = getUsers().filter(cur => cur.username === data.username)[0];
	res.send({...user, password: undefined});
});

router.post("/signup", async (req, res) => {
	const {username, password, userIcon} = req.body;
	if (!validate(username, password)) return res.sendStatus(400);
	if (getUsers().filter(cur => cur.username === username).length !== 0) return res.send([false, "This username is already taken!"]);

	const user = {username, userIcon};
	getUsers().push({...user, password: await hash(password)});

	res.send([true, {token: await createJwt({username}), user}]);
});

router.post("/login", async (req, res) => {
	const {username, password} = req.body;
	if (!validate(username, password) || getUsers().filter(cur => cur.username === username).length === 0) return res.send([false, null]);

	const user = getUsers().filter(cur => cur.username === username);
	if (user.length !== 1) return res.send([false, null]);

	if (!await verify(password, user[0].password)) return res.send([false, null]);

	res.send([true, {token: await createJwt({username}), user: {username, userIcon: user[0].userIcon}}]);
});

module.exports = router;