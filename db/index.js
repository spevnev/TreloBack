const {Pool} = require("pg");

const client = new Pool({
	max: 20,
	host: "localhost",
	port: 5432,
	database: "trelo",
});

module.exports = client;