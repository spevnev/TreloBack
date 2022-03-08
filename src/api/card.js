const {authenticated, hasAccess} = require("../services/authentication");
const cardDB = require("../db/card");
const validateBody = require("./schemas/validateBody");
const validate = require("./schemas/card");
const express = require("express");

const router = express.Router();

router.use(authenticated);


router.get("/:boardId", hasAccess, async (req, res) => {
	const {boardId} = req.params;

	const cards = await cardDB.getCards(boardId);
	if (cards === null) return res.sendStatus(400);

	res.send({id: boardId, cards});
});

router.post("/", hasAccess, validateBody(validate.changeCard), async (req, res) => {
	const {boardId, card} = req.body;

	if (!(await cardDB.addCard(boardId, card))) return res.sendStatus(400);
	res.sendStatus(200);
});

router.post("/deleteFile", hasAccess, async (req, res) => {
	const {url} = req.body;
	if (!url) return res.sendStatus(400);

	if (!(await cardDB.deleteFile(url))) return res.sendStatus(400);
	res.sendStatus(200);
});

router.post("/addFiles", hasAccess, validateBody(validate.addFile), (req, res) => {
	const {files, cardId} = req.body;

	for (let i = 0; i < files.length; i++) cardDB.addFile(cardId, files[i].url, files[i].filename);

	res.sendStatus(200);
});

router.put("/", hasAccess, validateBody(validate.changeCard), async (req, res) => {
	const {card} = req.body;

	if (!(await cardDB.changeCard(card))) return res.sendStatus(400);
	res.sendStatus(200);
});

router.put("/reorder", hasAccess, validateBody(validate.reorderCards), async (req, res) => {
	const {order} = req.body;

	if (!(await cardDB.reorderCards(order))) return res.sendStatus(400);
	res.sendStatus(200);
});

router.put("/renameFile", hasAccess, validateBody(validate.renameFile), async (req, res) => {
	const {filename, url} = req.body;

	if (!(await cardDB.renameFile(url, filename))) return res.sendStatus(400);
	res.sendStatus(200);
});

router.delete("/:boardId/:id", hasAccess, async (req, res) => {
	const {id} = req.params;
	if (!id) return res.sendStatus(400);

	if (!(await cardDB.deleteCard(id))) return res.sendStatus(400);
	res.sendStatus(200);
});


module.exports = router;