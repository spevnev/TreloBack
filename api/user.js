const express = require("express");
const {hash, verify} = require("../services/hash");
const {createJwt, verifyJwt} = require("../services/jwt");
const {users} = require("./tempStorage");
const router = express.Router();

const validate = (name, pass) => name && pass && name.length >= 4 && pass.length >= 4;

// -~=TEMP=~-
hash("test").then(password => {
	users.push({username: "test", password});
});

router.get("/", async (req, res) => {
	const token = req.headers.authorization;
	if (!token || !token.startsWith("Bearer ")) return res.sendStatus(401);

	const [valid, data] = await verifyJwt(token.split("Bearer ")[1]);
	if (!valid) return res.status(401).send(data);

	data.password = undefined;
	data.exp = undefined;
	data.iat = undefined;

	res.send(data);
});

router.post("/signup", async (req, res) => {
	const {username, password, userIcon} = req.body;
	if (!validate(username, password)) return res.sendStatus(400);
	if (users.filter(cur => cur.username === username).length !== 0) return res.send([false, "This username is already taken!"]);

	//TODO: validate userIcon to be base64 img data => save and in userIcon return the url to uploaded image!
	const user = {username, password: await hash(password), userIcon};
	users.push({...user});

	user.password = undefined;
	res.send([true, {token: await createJwt({username}), user}]);
});

router.post("/login", async (req, res) => {
	const {username, password} = req.body;
	if (!validate(username, password) || users.filter(cur => cur.username === username).length === 0) return res.sendStatus(400);

	const user = users.filter(cur => cur.username === username);
	if (user.length !== 1) return res.sendStatus(400);

	if (!await verify(password, user[0].password)) return res.sendStatus(400);

	res.send(JSON.stringify({token: await createJwt({username}), user: {username, userIcon: user[0].userIcon}}));
});

module.exports = router;