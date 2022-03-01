const client = require("./index");

const getCards = async boardId => {
	const res = await client.query(`
		select c.*, array_agg(row_to_json(f.*)::jsonb - 'cardid') as files
		from cards as c
        left join card_files as f on c.id = f.cardId
		where c.boardId = $1::uuid
		group by c.id;`,
		[boardId],
	).catch(e => e);
	if (!res) return null;

	return res.rows.map(cur => ({...cur, files: cur.files.filter(a => a), listId: cur.listid, listid: undefined, boardid: undefined}));
};

const addCard = async (boardId, {title, id, listId}) => {
	const res = await client.query(
		"insert into cards(title, id, listId, boardId, description, images, assigned) values ($1, $2, $3, $4, '', '{}', '{}');",
		[title, id, listId, boardId],
	).catch(e => e);

	return res ? res.rows : null;
};

const addFile = async (cardId, url, filename) => {
	const res = await client.query(
		"insert into card_files(cardid, url, filename) values ($1, $2, $3);",
		[cardId, url, filename],
	).catch(e => e);

	return res ? res.rows : null;
};

const renameFile = async (url, filename) => {
	const res = await client.query(
		"update card_files set filename = $1 where url = $2",
		[filename, url],
	).catch(e => e);

	return res ? res.rows : null;
};

const deleteFile = async url => {
	const res = await client.query(
		"delete from card_files where url = $1;",
		[url],
	).catch(e => e);

	return res ? res.rows : null;
};

const changeCard = async (title, description, listId, images, assigned, id) => {
	const res = await client.query(`
		update cards
		set (title, description, listId, images, assigned) = ($1, $2, $3, $4, $5)
		where cards.id = $6::uuid;`,
		[title, description, listId, images, assigned, id],
	).catch(e => console.log(e));

	return res ? res.rows : null;
};

const deleteCard = async id => {
	const res = await client.query(
		"delete from cards where cards.id = $1::uuid;",
		[id],
	).catch(e => console.log(e));

	return res ? res.rows : null;
};

module.exports = {getCards, addCard, changeCard, deleteCard, renameFile, addFile, deleteFile};