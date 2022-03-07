const addUser = require("./addUser");
const addList = require("./addList");
const changeRole = require("./changeRole");
const changeTitle = require("./changeBoard");

module.exports = {createBoard: changeTitle, addUser, addList, changeList: addList, changeRole, changeTitle};