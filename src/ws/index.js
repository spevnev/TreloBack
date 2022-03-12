const {Server} = require("socket.io");
const registerRoomHandler = require("./roomHandler");

const createWss = server => {
	const origin = process.env.FRONTEND_URL || "http://localhost:3001";
	const wss = new Server(server, {path: "/ws/", cors: {origin}});

	wss.on("connection", socket => registerRoomHandler(wss, socket));

	return wss;
};

module.exports = createWss;