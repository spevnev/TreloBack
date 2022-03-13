const boardDB = require("../db/board");
const {verifyJwt} = require("../services/jwt");

module.exports = (wss, socket) => {
	const joinRoom = async ({boardId, token}) => {
		const board = await boardDB.getBoard(boardId);
		const [err, data] = await verifyJwt(token);
		if (err || !board) return;

		if (board.users.filter(cur => cur.username === data.username).length !== 1) return;

		socket.join(boardId);
	};
	const leaveRoom = boardId => socket.leave(boardId);

	socket.on("room:join", joinRoom);
	socket.on("room:leave", leaveRoom);
};