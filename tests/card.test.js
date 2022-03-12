const supertest = require("supertest");
const {addBoard} = require("../src/db/board");
const {randomUUID} = require("crypto");

const app = require("../src/app")();


const sampleUser = {username: "CARD_USER", password: "TEST_PASSWORD", icon: randomUUID()};

const sampleSocketId = "sample_socket_id";

const sampleBoardId = randomUUID();
const invalidBoardId = "invalid_board_id";

const sampleCard = {
	"id": "b9d2335d-7900-44f7-99c8-7aa983f44466",
	"title": "Test",
	"description": "description",
	"images": [
		"https://res.cloudinary.com/trelo/image/authenticated/s--Y06Jhz-j--/v1646643133/a1297ad3-e328-4f0e-8f05-92d76faf62e8/f6ccb369-9515-4798-a058-6c748db8f554.png",
	],
	"assigned": [
		"TEST_USER",
	],
	"files": [],
	"listId": "304c4137-be62-46a7-92ae-2889ad344d97",
	"order": 0,
};
const invalidCard = {...sampleCard, order: -1, images: undefined};

const sampleOrder = [{id: sampleCard.id, order: 1}];

const sampleFile = {url: "string", filename: "string"};


describe("Card", () => {
	let token = null;

	beforeAll(async () => {
		// Signing up
		const res = await supertest(app)
			.post(`/api/auth/signup`)
			.send(sampleUser);

		token = res.body[1].token;
		expect(typeof token).toBe("string");

		// Creating board
		const success = await addBoard("sample board", sampleBoardId, sampleUser.username);
		expect(success).toBeTruthy();
	});

	describe("Create", () => {
		it("Should be 404 (Not found)", async () => {
			const res = await supertest(app)
				.post(`/api/card/`)
				.send({boardId: "any board id", card: sampleCard, socketId: sampleSocketId})
				.set("Authorization", `Bearer ${token}`);

			expect(res.statusCode).toBe(404);
		});

		it("Should be 401 (Unauthorized)", async () => {
			const res = await supertest(app)
				.post(`/api/card/`);

			expect(res.statusCode).toBe(401);
		});

		it("Should be 400 (Bad request)", async () => {
			const res = await supertest(app)
				.post(`/api/card/`)
				.send({boardId: sampleBoardId, card: invalidCard, socketId: sampleSocketId})
				.set("Authorization", `Bearer ${token}`);

			expect(res.statusCode).toBe(400);
		});

		it("Should be 200 (OK)", async () => {
			const res = await supertest(app)
				.post(`/api/card/`)
				.send({boardId: sampleBoardId, card: sampleCard, socketId: sampleSocketId})
				.set("Authorization", `Bearer ${token}`);

			expect(res.statusCode).toBe(200);
		});
	});

	describe("Get", () => {
		it("Should be 404 (Not found)", async () => {
			const res = await supertest(app)
				.get(`/api/card/${invalidBoardId}`)
				.set("Authorization", `Bearer ${token}`);

			expect(res.statusCode).toBe(404);
		});

		it("Should be 401 (Unauthorized)", async () => {
			const res = await supertest(app)
				.get(`/api/card/${sampleBoardId}`);

			expect(res.statusCode).toBe(401);
		});

		it("Should have valid body", async () => {
			const res = await supertest(app)
				.get(`/api/card/${sampleBoardId}`)
				.set("Authorization", `Bearer ${token}`);

			expect(res.statusCode).toBe(200);
			expect(res.body).toEqual({
				id: sampleBoardId,
				cards: [sampleCard],
			});
		});
	});

	describe("Change", () => {
		it("Should be 404 (Not found)", async () => {
			const res = await supertest(app)
				.put(`/api/card/`)
				.send({boardId: invalidBoardId, card: sampleCard, socketId: sampleSocketId})
				.set("Authorization", `Bearer ${token}`);

			expect(res.statusCode).toBe(404);
		});

		it("Should be 401 (Unauthorized)", async () => {
			const res = await supertest(app)
				.put(`/api/card/`);

			expect(res.statusCode).toBe(401);
		});

		it("Should be 400 (Bad request)", async () => {
			const res = await supertest(app)
				.put(`/api/card/`)
				.send({boardId: sampleBoardId, card: invalidCard, socketId: sampleSocketId})
				.set("Authorization", `Bearer ${token}`);

			expect(res.statusCode).toBe(400);
		});

		it("Should be 200 (OK)", async () => {
			const res = await supertest(app)
				.put(`/api/card/`)
				.send({boardId: sampleBoardId, card: sampleCard, socketId: sampleSocketId})
				.set("Authorization", `Bearer ${token}`);

			expect(res.statusCode).toBe(200);
		});
	});

	describe("Reorder", () => {
		it("Should be 404 (Not found)", async () => {
			const res = await supertest(app)
				.put(`/api/card/reorder`)
				.send({boardId: invalidBoardId, order: sampleOrder, socketId: sampleSocketId})
				.set("Authorization", `Bearer ${token}`);

			expect(res.statusCode).toBe(404);
		});

		it("Should be 401 (Unauthorized)", async () => {
			const res = await supertest(app)
				.put(`/api/card/reorder`);

			expect(res.statusCode).toBe(401);
		});

		it("Should be 400 (Bad request)", async () => {
			const res = await supertest(app)
				.put(`/api/card/reorder`)
				.send({boardId: sampleBoardId, order: undefined, socketId: sampleSocketId})
				.set("Authorization", `Bearer ${token}`);

			expect(res.statusCode).toBe(400);
		});

		it("Should be 200 (OK)", async () => {
			const res = await supertest(app)
				.put(`/api/card/reorder`)
				.send({boardId: sampleBoardId, order: sampleOrder, socketId: sampleSocketId})
				.set("Authorization", `Bearer ${token}`);

			expect(res.statusCode).toBe(200);
		});
	});

	describe("Files", () => {
		describe("Add", () => {
			it("Should be 404 (Not found)", async () => {
				const res = await supertest(app)
					.post(`/api/card/addFiles`)
					.send({boardId: invalidBoardId, cardId: sampleCard.id, files: [sampleFile], socketId: sampleSocketId})
					.set("Authorization", `Bearer ${token}`);

				expect(res.statusCode).toBe(404);
			});

			it("Should be 401 (Unauthorized)", async () => {
				const res = await supertest(app)
					.post(`/api/card/addFiles`);

				expect(res.statusCode).toBe(401);
			});

			it("Should be 400 (Bad request)", async () => {
				const res = await supertest(app)
					.post(`/api/card/addFiles`)
					.send({boardId: sampleBoardId, cardId: sampleCard.id, files: undefined, socketId: sampleSocketId})
					.set("Authorization", `Bearer ${token}`);

				expect(res.statusCode).toBe(400);
			});

			it("Should be 200 (OK)", async () => {
				const res = await supertest(app)
					.post(`/api/card/addFiles`)
					.send({boardId: sampleBoardId, cardId: sampleCard.id, files: [sampleFile], socketId: sampleSocketId})
					.set("Authorization", `Bearer ${token}`);

				expect(res.statusCode).toBe(200);
			});
		});

		describe("Change", () => {
			it("Should be 404 (Not found)", async () => {
				const res = await supertest(app)
					.put(`/api/card/renameFile`)
					.send({boardId: invalidBoardId, file: sampleFile, socketId: sampleSocketId})
					.set("Authorization", `Bearer ${token}`);

				expect(res.statusCode).toBe(404);
			});

			it("Should be 401 (Unauthorized)", async () => {
				const res = await supertest(app)
					.put(`/api/card/renameFile`);

				expect(res.statusCode).toBe(401);
			});

			it("Should be 400 (Bad request)", async () => {
				const invalidFile = {url: undefined, filename: "this_is_a_filename_over_32_characters_long"};

				const res = await supertest(app)
					.put(`/api/card/renameFile`)
					.send({boardId: sampleBoardId, file: invalidFile, socketId: sampleSocketId})
					.set("Authorization", `Bearer ${token}`);

				expect(res.statusCode).toBe(400);
			});

			it("Should be 200 (OK)", async () => {
				const res = await supertest(app)
					.put(`/api/card/renameFile`)
					.send({boardId: sampleBoardId, file: sampleFile, socketId: sampleSocketId})
					.set("Authorization", `Bearer ${token}`);

				expect(res.statusCode).toBe(200);
			});
		});

		describe("Delete", () => {
			it("Should be 404 (Not found)", async () => {
				const res = await supertest(app)
					.post(`/api/card/deleteFile`)
					.send({boardId: invalidBoardId, url: sampleFile.url})
					.set("Authorization", `Bearer ${token}`);

				expect(res.statusCode).toBe(404);
			});

			it("Should be 401 (Unauthorized)", async () => {
				const res = await supertest(app)
					.post(`/api/card/deleteFile`);

				expect(res.statusCode).toBe(401);
			});

			it("Should be 400 (Bad request)", async () => {
				const res = await supertest(app)
					.post(`/api/card/deleteFile`)
					.send({boardId: sampleBoardId, url: undefined})
					.set("Authorization", `Bearer ${token}`);

				expect(res.statusCode).toBe(400);
			});

			it("Should be 200 (OK)", async () => {
				const res = await supertest(app)
					.post(`/api/card/deleteFile`)
					.send({boardId: sampleBoardId, url: sampleFile.url})
					.set("Authorization", `Bearer ${token}`);

				expect(res.statusCode).toBe(200);
			});
		});
	});

	describe("Delete", () => {
		it("Should be 404 (Not found)", async () => {
			const res = await supertest(app)
				.delete(`/api/card/${invalidBoardId}/${sampleCard.id}`)
				.set("Authorization", `Bearer ${token}`);

			expect(res.statusCode).toBe(404);
		});

		it("Should be 401 (Unauthorized)", async () => {
			const res = await supertest(app)
				.delete(`/api/card/${sampleBoardId}/${sampleCard.id}`);

			expect(res.statusCode).toBe(401);
		});

		it("Should be 400 (Bad request)", async () => {
			const invalidCardId = "non-uuid-string";

			const res = await supertest(app)
				.delete(`/api/card/${sampleBoardId}/${invalidCardId}`)
				.set("Authorization", `Bearer ${token}`);

			expect(res.statusCode).toBe(400);
		});

		it("Should be 200 (OK)", async () => {
			const res = await supertest(app)
				.delete(`/api/card/${sampleBoardId}/${sampleCard.id}`)
				.set("Authorization", `Bearer ${token}`);

			expect(res.statusCode).toBe(200);
		});
	});
});
