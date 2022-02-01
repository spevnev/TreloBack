const {verifyJwt} = require("../services/jwt");

const verify = async token => {
	if (!token || !token.startsWith("Bearer ")) return [false, null];

	return await verifyJwt(token.split("Bearer ")[1]);
};


const authenticated = async (req, res, next) => {
	const [valid, data] = await verify(req.headers.authorization);
	if (!valid) return res.sendStatus(401);

	next();
};


const isOwner = async (req, boards) => {
	const [valid, data] = await verify(req.headers.authorization);
	if (!valid) return 401;

	const board = boards.filter(cur => cur.id === req.params.boardId);
	if (board.length === 0) return 404;

	if (board[0].users.filter(cur => cur.username === data.username && cur.isOwner).length !== 1) return 401;

	return 200;
};

const hasAccess = async (req, boards) => {
	const [valid, data] = await verify(req.headers.authorization);
	if (!valid) return 401;

	const board = boards.filter(cur => cur.id === req.params.boardId);
	if (board.length === 0) return 404;

	if (board[0].users.filter(cur => cur.username === data.username).length !== 1) return 401;

	return 200;
};

module.exports = {authenticated, hasAccess, isOwner};