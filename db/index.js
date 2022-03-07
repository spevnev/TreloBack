const {Pool} = require("pg");

const client = new Pool({
	max: 20,
	connectionString: process.env.DATABASE_URL || "postgresql://root:root@localhost/trelo",
	ssl: process.env.PRODUCTION ? {rejectUnauthorized: false} : false,
});

module.exports = client;