const createServer = require("./server");
const createTables = require("./db/createTables");

createTables();
createServer().listen(process.env.PORT || 3000, () => console.log("Server is running!"));