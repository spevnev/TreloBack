const {Pool} = require("pg");

const client = new Pool({
	max: 20,
	connectionString: process.env.DATABASE_URL || "postgresql://root:root@localhost/trelo",
	ssl: process.env.PRODUCTION ? {rejectUnauthorized: false} : false,
});

client.on("error", e => {
	if (process.env.NODE_ENV !== "test") throw new Error(e);
});

module.exports = client;