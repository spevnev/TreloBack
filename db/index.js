const {Pool} = require("pg");

const client = new Pool({
	max: 20,
	connectionString: process.env.DATABASE_URL ||
		`postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`,
	ssl: {
		rejectUnauthorized: false,
	},
});

console.log(process.env);
console.log(process.env.DATABASE_URL);

module.exports = client;