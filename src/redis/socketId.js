const client = require("./index");

const getSocketId = async username => new Promise((resolve, reject) => {
	try {
		if (process.env.NODE_ENV === "test") resolve();

		client.get(username, (err, res) => {
			if (err) reject(err);
			resolve(res);
		});
	} catch (e) {
		return null;
	}
});

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