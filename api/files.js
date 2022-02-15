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


router.post("/files", hasAccess, async (req, res) => {
	const {boardId} = req.body;
	if (!boardId) return res.sendStatus(400);

	const id = randomUUID();
	await writeFile(res, path.join(dir, boardId, "files"), id, req.body.file.replace(/^data:[a-z]+\/[a-z]+;base64,/, ""));

	if (!res.headersSent) res.send([null, id]);
});

router.post("/images", hasAccess, async (req, res) => {
	const {boardId, ext} = req.body;
	if (!boardId || !ext) return res.sendStatus(400);
	if (!req.body.image.match(/^data:image\/[a-z]+;base64,/)) return res.sendStatus(400);

	const id = randomUUID();
	await writeFile(res, path.join(dir, boardId, "images"), `${id}.${ext}`, req.body.image.replace(/^data:image\/[a-z]+;base64,/, ""));

	if (!res.headersSent) res.send([null, id]);
});

router.get("/:type/:boardId/:id/:ext?/", hasAccess, async (req, res) => {
	const {boardId, type, id, ext} = req.params;

	if (type === "images" && ext) res.sendFile(path.join(dir, boardId, type, `${id}.${ext}`));
	else if (type === "files") res.download(path.join(dir, boardId, type, id));
	else res.sendStatus(400);
});

module.exports = router;