const express = require("express");
const cors = require("cors");
const api = require("./api");
const dbClient = require("./db");

const app = express();

app.use(cors({origin: true}));
app.use("/api/", api);
app.use("/static/icons/", express.static("./public/icons"));

app.use((error, req, res, next) => {
	if (error.type === "entity.parse.failed") return res.status(400).send(error.message);
	next();
});

app.get("/", (req, res) => {
	res.send("works!");
});

dbClient.query("select now()", err => {
	if (err) throw new Error(err);
	else console.log("DB is connected!");
});

app.listen(3000, () => console.log("Server is running!"));