const {authenticated, hasAccess} = require("../services/authentication");
const express = require("express");
const router = express.Router();

const cards = [{
	id: "1",
	cards: [
		{
			title: "Card 1-1",
			id: "4",
			listId: "1",
			description: "Description",
			images: ["https://www.uedvision.com.ua/wp-content/uploads/2020/02/placeholder.png", "https://farm3.staticflickr.com/2821/33503322524_4e67143f45_k.jpg?momo_cache_bg_uuid=ac7fdf60-5867-4a87-bf83-2ded30d61c59"],
			files: [{filename: "sth.exe", id: "1"}],
			assigned: [{username: "Somebody", icon: "https://www.manufacturingusa.com/sites/manufacturingusa.com/files/default.png"}],
		},
		{
			title: "Card 1-2", id: "2", listId: "1", description: "Description", images: [], files: [
				{filename: "something.txt", id: "1"}, {filename: "file.exe", id: "2"},
			], assigned: [],
		},
		{title: "Card 2-2", id: "83", listId: "2", description: "Description", images: [], files: [], assigned: []},
	],
}, {
	id: "2",
	cards: [
		{
			title: "Card 1-1",
			id: "1",
			listId: "1",
			description: "Description",
			images: ["https://www.uedvision.com.ua/wp-content/uploads/2020/02/placeholder.png", "https://farm3.staticflickr.com/2821/33503322524_4e67143f45_k.jpg?momo_cache_bg_uuid=ac7fdf60-5867-4a87-bf83-2ded30d61c59"],
			files: [{filename: "sth.exe", id: "1"}],
			assigned: [{username: "Somebody", icon: "https://www.manufacturingusa.com/sites/manufacturingusa.com/files/default.png"}],
		},
		{
			title: "Card 1-2", id: "2", listId: "1", description: "Description", images: [], files: [
				{filename: "something.txt", id: "1"}, {filename: "file.exe", id: "2"},
			], assigned: [],
		},
		{
			title: "Card 2-1",
			id: "3",
			listId: "2",
			description: "Description",
			images: ["https://www.uedvision.com.ua/wp-content/uploads/2020/02/placeholder.png"],
			files: [],
			assigned: [],
		},
		{title: "Card 2-2", id: "4", listId: "2", description: "Description", images: [], files: [], assigned: []},
	],
}];

router.use(authenticated);
router.use(hasAccess);

router.get("/:boardId", (req, res) => {
	const boardCards = cards.filter(cur => cur.id === req.params.boardId);
	if (boardCards.length !== 1) res.sendStatus(404);

	res.send(boardCards[0]);
});

module.exports = router;