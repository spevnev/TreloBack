const {createClient} = require("redis");

if (process.env.NODE_ENV !== "test") {
	const client = createClient({
		url: process.env.REDISTOGO_URL || "redis://redistogo:0d40d763ba134ade31224ec0a0587ebc@sole.redistogo.com:10450",
	});
	console.log("Redis is connected!");

	client.on("error", e => {
		throw new Error(e);
	});

	module.exports = client;
}
