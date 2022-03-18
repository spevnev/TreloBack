const {createClient} = require("redis");

const client = createClient({
	url: process.env.REDISTOGO_URL || "redis://:password@localhost:6379",
});

client.on("error", e => {
	throw new Error(e);
});

client.connect().then(() => console.log("Redis is connected!"));

module.exports = client;