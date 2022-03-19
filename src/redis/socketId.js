const client = require("./index");

const getSocketId = username => {
	try {
		client.get(username, (err, res) => {
			console.log(err);
			console.log(res);
			return res;
		});
	} catch (e) {
		return null;
	}
};

const setSocketId = (username, socketId) => {
	try {
		client.set(username, socketId, "EX", 60 * 60 * 4);
	} catch (e) {
		return null;
	}
};

const deleteSocketId = username => {
	try {
		client.del(username);
	} catch (e) {
		return null;
	}
};

module.exports = {getSocketId, setSocketId, deleteSocketId};