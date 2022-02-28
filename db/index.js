const {Pool} = require("pg");

const client = new Pool({
	max: 20,
	connectionString: process.env.DATABASE_URL || "postgresql://root:root@localhost/trelo",
});

(async () => {
	try {
		await client.query("begin;");
		await client.query(`
		create table if not exists users
		(
			username varchar(25) primary key,
			password varchar(162)   not null,
			icon     uuid unique    not null
		);`);
		await client.query(`
		create table if not exists user_boards
		(
			username    varchar(25) not null,
			title       varchar(30) not null,
			isFavourite bool        not null,
			isOwner     bool        not null,
			boardId     uuid        not null
		);`);
		await client.query(`
		create table if not exists boards
		(
			title varchar(20) not null,
			id    uuid     primary key
		);`);
		await client.query(`
		create table if not exists board_lists
		(
			boardId uuid        not null,
			title   varchar(20) not null,
			id      uuid unique not null
		);`);
		await client.query(`
		create table if not exists board_users
		(
			boardId  uuid        not null,
			username varchar(25) not null,
			isOwner  bool        not null,
			icon     uuid        not null
		);`);
		await client.query(`
		create table if not exists cards
		(
			id          uuid        primary key,
			listId      uuid           not null,
			boardId     uuid           not null,
			title       varchar(64)    not null,
			description varchar(500)   not null,
			images      varchar(256)[] not null,
			assigned    varchar(25)[]  not null
		);`);
		await client.query(`
		create table if not exists card_files
		(
			cardId   uuid        not null,
			id       uuid primary key,
			filename varchar(30) not null
		);`);
		await client.query("commit;");
	} catch (e) {
		throw new Error(e);
	}
})();

module.exports = client;