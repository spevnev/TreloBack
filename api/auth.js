const userDB = require("../db/user");
const express = require("express");
const validateBody = require("./schemas/validateBody");
const validate = require("./schemas/auth");
const {randomUUID} = require("crypto");
const path = require("path");
const fs = require("fs");
const {hash, verify} = require("../services/hash");
const {createJwt} = require("../services/jwt");

const router = express.Router();

router.post("/signup", validateBody(validate.signup), async (req, res) => {
	const {username, password, icon} = req.body;

	const id = randomUUID();
	const fileDir = path.join(__dirname, "../public/icons");
	await fs.promises.stat(fileDir).catch(async () => await fs.promises.mkdir(fileDir));
	await fs.promises.writeFile(path.join(fileDir, `${id}.png`), icon.replace(/^data:image\/[a-z]+;base64,/, ""), "base64").catch(e => {
		if (!res.headersSent) res.send([e]);
	});

	const user = {username, icon: id};
	const error = await userDB.addUser({...user, password: await hash(password)});
	if (error) return res.send([error]);

	if (!res.headersSent) res.send([null, {token: await createJwt({username}), user}]);
});

router.post("/login", validateBody(validate.login), async (req, res) => {
	const {username, password} = req.body;

	const user = await userDB.getUser(username);
	if (user === null) return res.send(["Invalid username or password"]);

	if (!await verify(password, user.password)) return res.send(["Invalid username or password"]);

	res.send([null, {token: await createJwt({username}), user: {username, icon: user.icon}}]);
});

module.exports = router;