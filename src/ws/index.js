const {Server} = require("socket.io");
const registerRoomHandler = require("./roomHandler");
const {verifyJwt} = require("../services/jwt");
const {wsUsernameToSocketId} = require("../api/tempStorage");

const createWss = server => {
	const origin = process.env.FRONTEND_URL || "http://localhost:3001";
	const wss = new Server(server, {path: "/ws/", cors: {origin}});

	wss.on("connection", async socket => {
		const JWT = socket.handshake.auth.JWT;

		const [error, data] = await verifyJwt(JWT);
		if (error) return socket.disconnect(true);

		wsUsernameToSocketId[data.username] = socket.id;
		socket.on("disconnect", () => wsUsernameToSocketId[data.username] = undefined);

		registerRoomHandler(wss, socket);
	});

	return wss;
};

module.exports = createWss;