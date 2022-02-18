const client = require("./index");

const getBoard = async id => {
	const res = await client.query(`
	with l as (
        select array_agg(to_json(l)::jsonb - 'boardid') as lists
        from board_lists as l
        where l.boardid = $1::uuid
    ),
    u as (
        select array_agg(to_json(u)::jsonb - 'boardid') as users
        from board_users as u
        where u.boardid = $1::uuid
    )
	select * from boards, u, l where boards.id = $1::uuid;`,
		[id],
	).catch(e => e);
	if (!res || res.rows.length !== 1) return null;

	const r = res.rows[0];
	r.lists = r.lists || [];
	return {...r, lists: r.lists.filter(a => a), users: r.users.map(cur => ({icon: cur.icon, isOwner: cur.isowner, username: cur.username}))};
};

const addBoard = async (title, id, username) => {
	return await Promise.all([
		client.query(`insert into boards(title, id) VALUES ($1, $2);`, [title, id]),
		client.query(`
			insert into board_users(boardId, username, isOwner, icon) 
			values ($1::uuid, $2::varchar, true, (select icon from users where users.username = $2::varchar))`,
			[id, username],
		),
		client.query(`
			insert into user_boards(username, title, isfavourite, isowner, boardid)
			values ($1, $2, false, true, $3)`,
			[username, title, id],
		),
	]).catch(e => null);
};

const changeTitle = async (boardId, title) => {
	return await Promise.all([
		client.query(`
			update boards set title = $1 where boards.id = $2::uuid;`,
			[title, boardId],
		),
		client.query(`
			update user_boards
			set title = $1
  			where user_boards.boardid = $2::uuid;`,
			[title, boardId],
		),
	]).catch(e => null);
};

const deleteBoard = async id => {
	return await Promise.all([
		client.query("delete from card_files where card_files.cardid in (select cardid from cards where boardid = $1::uuid);", [id]),
		client.query("delete from cards where cards.boardid = $1::uuid;", [id]),
		client.query("delete from boards where boards.id = $1::uuid;", [id]),
		client.query("delete from board_users where board_users.boardid = $1::uuid;", [id]),
		client.query("delete from board_lists where board_lists.boardid = $1::uuid;", [id]),
		client.query("delete from user_boards where user_boards.boardid = $1::uuid;", [id]),
	]).catch(e => null);
};

const addUser = async (board, username) => {
	const user = await client.query(`
			select * from users where username = $1`,
		[username],
	).catch(e => e);
	if (!user || user.rows.length !== 1) return ["User doesn't exist"];

	await Promise.all([
		client.query(`
			insert into board_users(boardId, username, isOwner, icon) 
			values ($1::uuid, $2::varchar, false, (select icon from users where users.username = $2::varchar))`,
			[board.id, username],
		),
		client.query(`
			insert into user_boards(username, title, isfavourite, isowner, boardid)
			values ($1, $2, false, false, $3)`,
			[username, board.title, board.id],
		),
	]).catch(e => e);

	return [null, {...user.rows[0], password: undefined}];
};

const deleteUser = async (boardId, username) => {
	return await Promise.all([
		client.query(
			"delete from board_users where boardid = $1 and username = $2;",
			[boardId, username],
		),
		client.query(
			"delete from user_boards where boardid = $1 and username = $2;",
			[boardId, username],
		),
	]).catch(e => null);
};

const changeRole = async (boardId, username, isOwner) => {
	return await Promise.all([
		client.query(`
			update board_users set isowner = $1::bool
			where board_users.boardid = $2::uuid 
			and board_users.username = $3;`,
			[isOwner, boardId, username],
		),
		client.query(`
			update user_boards set isowner = $1::bool
			where user_boards.username = $2 and user_boards.boardid = $3::uuid;`,
			[isOwner, username, boardId],
		),
	]).catch(e => null);
};

const addList = async (boardId, id, title) => {
	const res = await client.query(
		"insert into board_lists(boardId, title, id) values ($1, $2, $3);",
		[boardId, title, id],
	).catch(e => null);

	return res ? res.rows : null;
};

const changeList = async (id, title) => {
	const res = await client.query(
		`update board_lists set title = $1 where board_lists.id = $2::uuid;`,
		[title, id],
	).catch(e => e);

	return res ? res.rows : null;
};

const deleteList = async id => {
	return await Promise.all([
		client.query("delete from board_lists where id = $1::uuid;", [id]),
		client.query("delete from card_files where cardid in (select id from cards where listid = $1::uuid)", [id]),
		client.query("delete from cards where listid = $1::uuid", [id]),
	]).catch(e => null);
};

module.exports = {getBoard, addBoard, addUser, changeTitle, deleteBoard, deleteUser, changeRole, addList, changeList, deleteList};