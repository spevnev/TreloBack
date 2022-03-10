const {randomUUID} = require("crypto");
const {authenticated, hasAccess} = require("../services/authentication");
const upload = require("../services/upload");
const express = require("express");

const router = express.Router();

router.use(authenticated);


router.post("/upload", hasAccess, async (req, res) => {
	const {boardId, files} = req.body;
	if (!boardId || !files) return res.sendStatus(400);

	try {
		const uploadResponses = await Promise.all(files.map(file => upload(file, `${boardId}/${randomUUID()}`)));
		res.send([null, uploadResponses.map(cur => cur.secure_url)]);
	} catch (e) {
		res.send([e]);
	}
});


module.exports = router;