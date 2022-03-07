const {randomUUID} = require("crypto");
const {authenticated, hasAccess} = require("../services/authentication");
const upload = require("../services/upload");
const express = require("express");

const router = express.Router();

router.use(authenticated);


router.post("/upload", hasAccess, async (req, res) => {
	const {boardId, files} = req.body;

	await Promise.all(files.map(file => upload(file, `${boardId}/${randomUUID()}`)))
		.then(result => res.send([null, result.map(cur => cur.secure_url)]))
		.catch(e => res.send([e]));
});


module.exports = router;