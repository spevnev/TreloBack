const client = require("./index");

const testConnection = async () => {
	await client.query("select now()")
		.catch(e => {
			throw new Error(e);
		});

	console.log("DB is connected!");
};

module.exports = testConnection;