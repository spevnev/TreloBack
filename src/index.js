const createApp = require("./app");
const createTables = require("./db/createTables");
const createWss = require("./ws");

createTables();

let wssReference = [];
const app = createApp(wssReference);

const server = app.listen(process.env.PORT || 3000, () => console.log("Server is running!"));
const wss = createWss(server);

wssReference.push(wss);