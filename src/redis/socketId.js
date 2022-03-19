const client = require("./index");

const getSocketId = async username => new Promise((resolve, reject) => {
	try {
		client.get(username, (err, res) => {
			if (err) reject(err);
			console.log("test");
			resolve(res);
		});
	} catch (e) {
		console.log(e);
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