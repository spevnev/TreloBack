let boards = [{
	title: "Board 1",
	id: "1",
	users: [{username: "test", userIcon: "https://www.manufacturingusa.com/sites/manufacturingusa.com/files/default.png", isOwner: true}, {
		username: "Username 2", userIcon: "https://www.manufacturingusa.com/sites/manufacturingusa.com/files/default.png", isOwner: false,
	}],
	lists: [{title: "First list", id: "1"}, {title: "List", id: "2"}],
}, {
	title: "Board 2",
	id: "2",
	users: [{username: "test", userIcon: "https://www.manufacturingusa.com/sites/manufacturingusa.com/files/default.png", isOwner: false}, {
		username: "Username 2", userIcon: "https://www.manufacturingusa.com/sites/manufacturingusa.com/files/default.png", isOwner: true,
	}],
	lists: [{title: "First list", id: "1"}, {title: "List", id: "2"}],
}];
const getBoards = () => boards;
const setBoards = newBoards => boards = newBoards;

let cards = [{
	id: "1", cards: [{
		title: "Card 1-1",
		id: "4",
		listId: "1",
		description: "Description",
		images: ["https://www.uedvision.com.ua/wp-content/uploads/2020/02/placeholder.png", "https://farm3.staticflickr.com/2821/33503322524_4e67143f45_k.jpg?momo_cache_bg_uuid=ac7fdf60-5867-4a87-bf83-2ded30d61c59"],
		files: [{filename: "sth.exe", id: "1"}],
		assigned: [{username: "Somebody", userIcon: "https://www.manufacturingusa.com/sites/manufacturingusa.com/files/default.png"}],
	}, {
		title: "Card 1-2",
		id: "2",
		listId: "1",
		description: "Description",
		images: [],
		files: [{filename: "something.txt", id: "1"}, {filename: "file.exe", id: "2"}],
		assigned: [],
	}, {title: "Card 2-2", id: "83", listId: "2", description: "Description", images: [], files: [], assigned: []}],
}, {
	id: "2", cards: [{
		title: "Card 1-1",
		id: "1",
		listId: "1",
		description: "Description",
		images: ["https://www.uedvision.com.ua/wp-content/uploads/2020/02/placeholder.png", "https://farm3.staticflickr.com/2821/33503322524_4e67143f45_k.jpg?momo_cache_bg_uuid=ac7fdf60-5867-4a87-bf83-2ded30d61c59"],
		files: [{filename: "sth.exe", id: "1"}],
		assigned: [{username: "Somebody", userIcon: "https://www.manufacturingusa.com/sites/manufacturingusa.com/files/default.png"}],
	}, {
		title: "Card 1-2",
		id: "2",
		listId: "1",
		description: "Description",
		images: [],
		files: [{filename: "something.txt", id: "1"}, {filename: "file.exe", id: "2"}],
		assigned: [],
	}, {
		title: "Card 2-1",
		id: "3",
		listId: "2",
		description: "Description",
		images: ["https://www.uedvision.com.ua/wp-content/uploads/2020/02/placeholder.png"],
		files: [],
		assigned: [],
	}, {title: "Card 2-2", id: "4", listId: "2", description: "Description", images: [], files: [], assigned: []}],
}];
const getCards = () => cards;

let users = [];
const getUsers = () => users;
const setUsers = newUsers => users = newUsers;

module.exports = {getBoards, setBoards, getCards, getUsers, setUsers};