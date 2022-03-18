const createApp = require("./app");
const createTables = require("./db/createTables");
const createWss = require("./ws");
const psqlClient = require("./db");
const redisClient = require("./redis");

createTables();

let wssReference = []; // wtf
const app = createApp(wssReference);

const server = app.listen(process.env.PORT || 3000, () => console.log("Server is running!"));
const wss = createWss(server);

wssReference.push(wss);


process.on("exit", async () => {
	try {
		await psqlClient.end();
		await redisClient.quit();
	} catch (e) {
	}
});