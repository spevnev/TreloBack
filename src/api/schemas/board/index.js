const addUser = require("./addUser");
const addList = require("./addList");
const changeUser = require("./changeUser");
const changeBoard = require("./changeBoard");
const createBoard = require("./createBoard");

module.exports = {createBoard, addUser, addList, changeList: addList, changeUser, changeBoard};