const {verifyJwt} = require("../services/jwt");
const {getBoards} = require("../api/tempStorage");

const verify = async token => {
	if (!token || !token.startsWith("Bearer ")) return ["Error"];

	return await verifyJwt(token.split("Bearer ")[1]);
};


const authenticated = async (req, res, next) => {
	const [error, data] = await verify(req.headers.authorization);
	if (!data) return res.status(401).send(error);

	next();
};


const isOwner = async (req, boardId) => {
	const [error, data] = await verify(req.headers.authorization);
	if (error !== null) return 401;

	const board = getBoards().filter(cur => cur.id === (boardId || req.params.boardId));
	if (board.length === 0) return 404;

	if (board[0].users.filter(cur => cur.username === data.username && cur.isOwner).length !== 1) return 401;

	return 200;
};

const hasAccess = async (req, boards) => {
	const [error, data] = await verify(req.headers.authorization);
	if (error !== null) return 401;

	const board = boards.filter(cur => cur.id === req.params.boardId);
	if (board.length === 0) return 404;

	if (board[0].users.filter(cur => cur.username === data.username).length !== 1) return 401;

	return 200;
};

module.exports = {authenticated, hasAccess, isOwner};