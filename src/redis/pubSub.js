const redisClient = require("./index");

const subscribe = async wss => {
	const client = redisClient.duplicate();
	await client.connect();

	await client.subscribe("ws", msg => {
		const {boardId, socketId, event, payload} = JSON.parse(msg);
		wss.to([boardId]).except(socketId).emit(event, payload);
	});
};

const publish = async (boardId, socketId, event, payload) => {
	try {
		const msg = JSON.stringify({boardId, socketId, event, payload});
		await redisClient.publish("ws", msg);
	} catch (e) {
		if (process.env.NODE_ENV !== "test") throw new Error(e);
	}
};

module.exports = {subscribe, publish};