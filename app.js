const express = require("express");
const cors = require("cors");
const api = require("./api");
const helmet = require("helmet");
const dbClient = require("./db");

const app = express();

app.use(helmet());
app.use(cors({origin: true}));

app.use("/api/", api);

app.use((error, req, res, next) => {
	if (error.type === "entity.parse.failed") return res.status(400).send(error.message);
	next();
});

dbClient.query("select now()", err => {
	if (err) throw new Error(err);
	else console.log("DB is connected!");
});

app.listen(process.env.PORT || 3000, () => console.log("Server is running!"));