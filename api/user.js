const express = require("express");
const {hash, verify} = require("../services/hash");
const {createJwt} = require("../services/jwt");
const router = express.Router();

const validate = (name, pass) => name && pass && name.length >= 4 && pass.length >= 4;

const users = [];

router.get("/exists/:username", (req, res) => {
	const username = req.params.username;
	if (!username) return res.sendStatus(400);

	return users.filter(cur => cur.username === username).length !== 0;
});

router.post("/signup", async (req, res) => {
	const {username, password, userIcon} = req.body;
	if (!validate(username, password) || users.filter(cur => cur.username === username).length !== 0) return res.sendStatus(400);

	//TODO: validate userIcon to be base64 img data => save and in userIcon return the url to uploaded image!
	users.push({username, password: await hash(password), userIcon});

	res.send(await createJwt({username}));
});

router.post("/login", async (req, res) => {
	const {username, password} = req.body;
	if (!validate(username, password) || users.filter(cur => cur.username === username).length === 0) return res.sendStatus(400);

	const user = users.filter(cur => cur.username === username);
	if (user.length !== 1) return res.sendStatus(400);

	if (!await verify(password, user[0].password)) return res.sendStatus(400);

	res.send(await createJwt({username}));
});

module.exports = router;