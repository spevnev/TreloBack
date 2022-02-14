let boards = [];
const getBoards = () => boards;
const setBoards = newBoards => boards = newBoards;

let cards = [];
const getCards = () => cards;
const setCards = newCards => cards = newCards;

let users = [];
const getUsers = () => users;
const setUsers = newUsers => users = newUsers;

module.exports = {getBoards, setBoards, getCards, setCards, getUsers, setUsers};