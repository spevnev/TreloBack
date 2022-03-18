const {createClient} = require("redis");

if (process.env.NODE_ENV !== "test") {
	const client = createClient({
		url: process.env.REDISTOGO_URL.match("(redis:\/\/).{1,20}:(.*@.*:[0-9]*\/)").slice(1).join("") || "redis://:password@localhost:6379",
	});
	console.log("Redis is connected!");

	client.on("error", e => {
		throw new Error(e);
	});

	module.exports = client;
}
