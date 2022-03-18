const client = require("./index");

const getSocketId = async username => {
	try {
		return await client.get(username);
	} catch (e) {
		return null;
	}
};

const setSocketId = async (username, socketId) => {
	try {
		await client.setEx(username, 60 * 60, socketId);
	} catch (e) {
		return null;
	}
};

const deleteSocketId = async username => {
	try {
		await client.del(username);
	} catch (e) {
		return null;
	}
};

module.exports = {getSocketId, setSocketId, deleteSocketId};