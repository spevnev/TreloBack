module.exports = (wss, socket) => {
	const joinRoom = boardId => socket.join(boardId);
	const leaveRoom = boardId => socket.leave(boardId);

	socket.on("room:join", joinRoom);
	socket.on("room:leave", leaveRoom);
};