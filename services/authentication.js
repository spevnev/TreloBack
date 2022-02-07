const {verifyJwt} = require("../services/jwt");
const {getBoards, getUsers} = require("../api/tempStorage");

const verify = async token => {
	if (!token || !token.startsWith("Bearer ")) return ["Error"];

	return await verifyJwt(token.split("Bearer ")[1]);
};

const authenticated = async (req, res, next) => {
	const [error, data] = await verify(req.headers.authorization);
	if (!data) return res.status(401).send(error);

	res.locals.data = data;

	next();
};

const isOwner = async (req, res, next) => {
	const data = res.locals.data;
	const boardId = req.body.boardId || req.params.boardId;
	if (!boardId) return res.sendStatus(404);

	const board = getBoards().filter(cur => cur.id === boardId);

	if (board.length !== 1) return res.sendStatus(404);
	if (board[0].users.filter(cur => cur.username === data.username && cur.isOwner).length !== 1) return res.sendStatus(401);

	next();
};

const hasAccess = async (req, res, next) => {
	const data = res.locals.data;
	const boardId = req.body.boardId || req.params.boardId;
	if (!boardId) return res.sendStatus(404);

	const board = getBoards().filter(cur => cur.id === boardId);

	if (board.length === 0) return res.sendStatus(404);
	if (board[0].users.filter(cur => cur.username === data.username).length !== 1) return res.sendStatus(401);

	next();
};

module.exports = {authenticated, hasAccess, isOwner};