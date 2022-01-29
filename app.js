const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const api = require("./api");
app.use("/api/", api);

app.listen(3000, () => console.log("Server is running!"));