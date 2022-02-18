const client = require("./index");

const addUser = async user => {
	let error = false;
	await client.query(
		"insert into users(username, password, icon) values ($1, $2, $3);",
		[user.username, user.password, user.icon],
	).catch(e => {
		if (e.constraint === "users_pkey") error = "This username is already taken!";
	});

	return error;
};

const getUser = async username => {
	const res = await client.query(`
		select u.*, array_agg(to_json(b)::jsonb - 'username') as boards
		from users as u
        left join user_boards b on u.username = b.username
		where u.username = $1
		group by u.username;`,
		[username],
	).catch(e => e);
	if (!res || res.rows.length !== 1) return null;

	const r = res.rows[0];
	return {...r, boards: r.boards.filter(a => a).map(cur => ({isOwner: cur.isowner, isFavourite: cur.isfavourite, id: cur.boardid, title: cur.title}))};
};

module.exports = {addUser, getUser};