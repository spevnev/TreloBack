const {authenticated} = require("../services/authentication");
const userDB = require("../db/user");
const boardDB = require("../db/board");
const express = require("express");

const router = express.Router();

router.use(authenticated);


router.get("/", async (req, res) => {
	const data = res.locals.user;

	const user = await userDB.getUser(data.username);
	if (!user) return res.send(["Invalid token - auth doesn't exist!"]);

	res.send([null, {...user, password: undefined}]);
});

router.post("/leave", async (req, res) => {
	const {boardId} = req.body;
	if (!boardId) return res.sendStatus(400);

	await boardDB.deleteUser(boardId, res.locals.user.username);

	res.sendStatus(200);
});

router.put("/favourite", async (req, res) => {
	const {boardId, fav} = req.body;
	if (!boardId || fav === undefined) return res.sendStatus(400);

	await userDB.toggleFavourite(boardId, res.locals.user.username, fav);

	res.sendStatus(200);
});


module.exports = router;