const {createClient} = require("redis");

if (process.env.NODE_ENV !== "test") {
	const client = createClient({url: process.env.REDIS_URL});

	client.connect().then(() => console.log("Redis is connected!"));

	client.on("error", e => {
		throw new Error(e);
	});

	module.exports = client;
}
