const DBGlobalTeardown = require("@databases/pg-test/jest/globalTeardown");
const psqlClient = require("../../src/db");
const redisClient = require("../../src/redis");

const globalTeardown = async () => {
	await DBGlobalTeardown();
	await psqlClient.end();
	await redisClient.quit();
};

module.exports = globalTeardown;