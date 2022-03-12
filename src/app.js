const helmet = require("helmet");
const cors = require("cors");
const api = require("./api");
const express = require("express");

const createApp = wssReference => {
	const app = express();

	app.use(helmet());
	app.use(cors({origin: true}));

	app.use((req, res, next) => {
		res.locals.wss = wssReference[0];
		next();
	});

	app.use("/api/", api);

	app.use((error, req, res, next) => {
		if (error.type === "entity.parse.failed") return res.status(400).send(error.message);
		next();
	});

	return app;
};

module.exports = createApp;