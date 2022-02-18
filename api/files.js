const path = require("path");
const fs = require("fs");
const {randomUUID} = require("crypto");
const {authenticated, hasAccess} = require("../services/authentication");
const express = require("express");

const router = express.Router();

router.use(authenticated);

const dir = path.join(__dirname, "../public/files/");

const writeFile = async (res, fileDir, filename, data) => {
	await fs.promises.stat(fileDir).catch(async () => await fs.promises.mkdir(fileDir, {recursive: true}));
	await fs.promises.writeFile(path.join(fileDir, filename), data, "base64").catch(e => {
		if (!res.headersSent) res.send([e]);
	});
};


router.get("/:type/:boardId/:id/", hasAccess, (req, res) => {
	const {boardId, type, id} = req.params;

	if (type === "images") res.sendFile(path.join(dir, boardId, type, `${id}.png`));
	else if (type === "files") res.download(path.join(dir, boardId, type, id));
	else res.sendStatus(400);
});

router.post("/files", hasAccess, async (req, res) => {
	const {boardId, files} = req.body;
	const ids = [];

	files.forEach(file => {
		const id = randomUUID();
		ids.push(id);
		writeFile(res, path.join(dir, boardId, "files"), id, file.replace(/^data:[a-z]+\/[a-z]+;base64,/, ""));
	});

	if (!res.headersSent) res.send([null, ids]);
});

router.post("/images", hasAccess, async (req, res) => {
	const {boardId, images} = req.body;
	const ids = [];

	images.forEach(image => {
		if (!image.match(/^data:image\/[a-z]+;base64,/)) res.sendStatus(400);
		const id = randomUUID();
		ids.push(id);
		writeFile(res, path.join(dir, boardId, "images"), `${id}.png`, image.replace(/^data:image\/[a-z]+;base64,/, ""));
	});

	if (!res.headersSent) res.send([null, ids]);
});

module.exports = router;