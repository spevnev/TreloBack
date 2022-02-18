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

	const success = await cardDB.addCard(boardId, card);
	if (!success) return res.sendStatus(400);

	res.sendStatus(200);
});

router.post("/deleteFile", hasAccess, async (req, res) => {
	const {id} = req.body;
	if (!id) return res.sendStatus(400);

	const success = await cardDB.deleteFile(id);
	if (!success) return res.sendStatus(400);

	res.sendStatus(200);
});

router.post("/addFiles", hasAccess, validateBody(validate.addFile), (req, res) => {
	const {files, cardId} = req.body;

	for (let i = 0; i < files.length; i++) cardDB.addFile(cardId, files[i].id, files[i].filename);

	res.sendStatus(200);
});

router.put("/", hasAccess, validateBody(validate.changeCard), async (req, res) => {
	const {card} = req.body;

	const success = await cardDB.changeCard(card.title, card.description, card.listId, card.images, card.assigned, card.id);
	if (!success) return res.sendStatus(400);

	res.sendStatus(200);
});

router.put("/renameFile", hasAccess, validateBody(validate.renameFile), async (req, res) => {
	const {filename, id} = req.body;

	const success = await cardDB.renameFile(id, filename);
	if (!success) return res.sendStatus(400);

	res.sendStatus(200);
});

router.delete("/:boardId/:id", hasAccess, async (req, res) => {
	const {id} = req.params;

	const success = await cardDB.deleteCard(id);
	if (!success) return res.sendStatus(400);

	res.sendStatus(200);
});

module.exports = router;