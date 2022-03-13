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


	const wss = res.locals.wss;
	const socketId = res.locals.socketId;

	wss.to([boardId]).except(socketId).emit("board:deleteUser", {username: res.locals.user.username, boardId});
});

router.put("/favourite", async (req, res) => {
	const {boardId, isFavourite} = req.body;
	if (!boardId || isFavourite === undefined) return res.sendStatus(400);

	if (!(await userDB.toggleFavourite(boardId, res.locals.user.username, isFavourite))) return res.sendStatus(400);
	res.sendStatus(200);
});


module.exports = router;