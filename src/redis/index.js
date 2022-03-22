const {createClient} = require("redis");

if (process.env.NODE_ENV !== "test") {
	const client = createClient({url: "redis://:password@localhost:6379"});

	client.connect().then(() => console.log("Redis is connected!"));

	client.on("error", e => {
		throw new Error(e);
	});

	module.exports = client;
}
