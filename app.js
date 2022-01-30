const express = require("express");
const cors = require("cors");
const api = require("./api");

const app = express();

app.use(cors());
app.use(express.json({limit: "5mb"}));
app.use("/api/", api);
app.use((error, req, res, next) => {
	if (error.type === "entity.parse.failed") return res.status(400).send(error.message);
	next();
});

app.listen(3000, () => console.log("Server is running!"));