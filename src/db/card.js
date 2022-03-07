const client = require("./index");

const getCards = async boardId => {
	const res = await client.query(`
		select c.*, array_agg(row_to_json(f.*)::jsonb - 'cardid') as files
		from cards as c
        left join card_files as f on c.id = f.cardId
		where c.boardId = $1::uuid
		group by c.id;`,
		[boardId],
	).catch(e => null);
	if (!res) return null;

	return res.rows.map(cur => ({
		...cur,
		files: cur.files.filter(a => a),
		listId: cur.listid, listid: undefined,
		order: cur.cardorder, cardorder: undefined,
		boardid: undefined,
	}));
};

const addCard = async (boardId, {title, id, listId, order}) => {
	const res = await client.query(
		"insert into cards(title, id, listId, cardOrder, boardId, description, images, assigned) values ($1, $2, $3, $4, $5, '', '{}', '{}');",
		[title, id, listId, order, boardId],
	).catch(e => null);

	return res ? res.rows : null;
};

const addFile = async (cardId, url, filename) => {
	const res = await client.query(
		"insert into card_files(cardid, url, filename) values ($1, $2, $3);",
		[cardId, url, filename],
	).catch(e => null);

	return res ? res.rows : null;
};

const renameFile = async (url, filename) => {
	const res = await client.query(
		"update card_files set filename = $1 where url = $2",
		[filename, url],
	).catch(e => null);

	return res ? res.rows : null;
};

const deleteFile = async url => {
	const res = await client.query(
		"delete from card_files where url = $1;",
		[url],
	).catch(e => null);

	return res ? res.rows : null;
};

const changeCard = async ({title, description, listId, order, images, assigned, id}) => {
	const res = await client.query(`
		update cards
		set (title, description, listId, cardorder, images, assigned) = ($1, $2, $3, $4, $5, $6)
		where cards.id = $7::uuid;`,
		[title, description, listId, order, images, assigned, id],
	).catch(e => null);

	return res ? res.rows : null;
};

const reorderCards = async order => {
	const values = order.map(({order, id}) => `(${order}::smallint,'${id}'::uuid)`).join(",");

	const res = await client.query(`
		update cards 
		set cardorder = t.cardorder 
		from (values ${values} ) 
		as t(cardorder, id) 
		where t.id = cards.id;`,
	).catch(e => null);

	return res ? res.rows : null;
};

const deleteCard = async id => {
	const res = await client.query(
		"delete from cards where cards.id = $1::uuid;",
		[id],
	).catch(e => null);

	return res ? res.rows : null;
};

module.exports = {getCards, addCard, changeCard, reorderCards, deleteCard, renameFile, addFile, deleteFile};