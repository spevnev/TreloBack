const {createClient} = require("redis");

if (process.env.NODE_ENV !== "test") {
	console.log(process.env);
	console.log(process.env.REDISTOGO_URL);
	const client = createClient({
		url: process.env.REDISTOGO_URL || "redis://:password@localhost:6379",
	});
	console.log("Redis is connected!");

	client.on("error", e => {
		throw new Error(e);
	});

	module.exports = client;
}
