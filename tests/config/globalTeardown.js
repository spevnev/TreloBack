const DBGlobalTeardown = require("@databases/pg-test/jest/globalTeardown");
const client = require("../../src/db");

const globalTeardown = async () => {
	await DBGlobalTeardown();
	await client.end();
};

module.exports = globalTeardown;