const userDB = require("../db/user");
const validateBody = require("./schemas/validateBody");
const validate = require("./schemas/auth");
const {randomUUID} = require("crypto");
const upload = require("../services/upload");
const {hash, verify} = require("../services/hash");
const {createJwt} = require("../services/jwt");
const express = require("express");

const router = express.Router();


router.post("/icon", async (req, res) => {
	const {icon} = req.body;
	if (!icon) return res.sendStatus(400);

	res.send((await upload(icon, `icons/${randomUUID()}`).catch(e => e)).secure_url);
});

router.post("/signup", validateBody(validate.signup), async (req, res) => {
	const {username, password, icon} = req.body;

	const error = await userDB.addUser({username, icon, password: await hash(password)});
	if (error) return res.send([error]);

	if (!res.headersSent) res.send([null, {token: await createJwt({username}), user: {username, icon}}]);
});

router.post("/login", validateBody(validate.login), async (req, res) => {
	const {username, password} = req.body;

	const user = await userDB.getUser(username);
	if (user === null) return res.send(["Invalid username or password"]);

	if (!await verify(password, user.password)) return res.send(["Invalid username or password"]);

	res.send([null, {token: await createJwt({username}), user: {username, icon: user.icon}}]);
});

module.exports = router;