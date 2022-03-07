const DBGlobalTeardown = require("@databases/pg-test/jest/globalTeardown");
const client = require("../../db");

const globalTeardown = async () => {
	await client.end();

	await DBGlobalTeardown();
};

module.exports = globalTeardown;