const DBGlobalSetup = require("@databases/pg-test/jest/globalSetup");

const globalSetup = async () => {
	await DBGlobalSetup();

	const createTables = require("../../db/createTables");
	await createTables();
};

module.exports = globalSetup;