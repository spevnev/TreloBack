const client = require("./index");

const getSocketId = async username => {
	try {
		return await client.get(username);
	} catch (e) {
		console.log(e);
	}
};

const setSocketId = async (username, socketId) => {
	try {
		const expirationTime = 60 * 60 * 4;
		await client.set(username, socketId, {"EX": expirationTime});
	} catch (e) {
		console.log(e);
	}
};

const deleteSocketId = async username => {
	try {
		await client.del(username);
	} catch (e) {
		console.log(e);
	}
};

module.exports = {getSocketId, setSocketId, deleteSocketId};