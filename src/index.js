const createApp = require("./app");
const createTables = require("./db/createTables");
const createWss = require("./ws");
const psqlClient = require("./db");
const redisClient = require("./redis");
const {subscribe} = require("./redis/pubSub");

const port = process.env.PORT || 3000;
const server = createApp().listen(port, () => console.log(`Server is running on port ${port}!`));

createTables();
subscribe(createWss(server));

process.on("exit", async () => {
	try {
		await psqlClient.end();
		await redisClient.quit();
	} catch (e) {
	}
});