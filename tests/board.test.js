const supertest = require("supertest");
const {randomUUID} = require("crypto");

const app = require("../src/server")();


const sampleUser = {username: "BOARD_USER", password: "TEST_PASSWORD", icon: randomUUID()};

const sampleBoardId = randomUUID();
const invalidBoardId = "invalid_board_id";

const sampleBoard = {boardId: sampleBoardId, title: "sample board"};

const sampleList = {id: randomUUID(), title: "title", order: 0};
const invalidList = {id: randomUUID(), title: "title", order: -1};


describe("Board", () => {
	let token = null;

	beforeAll(async () => {
		// Signing up
		let res = await supertest(app)
			.post(`/api/auth/signup`)
			.send(sampleUser);

		token = res.body[1].token;
		expect(typeof token).toBe("string");
	});

	describe("Create", () => {
		it("Should be 401 (Unauthorized)", async () => {
			const res = await supertest(app)
				.post("/api/board");

			expect(res.statusCode).toBe(401);
		});

		it("Should be 400 (Bad request)", async () => {
			const res = await supertest(app)
				.post("/api/board")
				.send({boardId: randomUUID()})
				.set("Authorization", `Bearer ${token}`);

			expect(res.statusCode).toBe(400);
		});

		it("Should be 200 (OK)", async () => {
			const res = await supertest(app)
				.post("/api/board")
				.send(sampleBoard)
				.set("Authorization", `Bearer ${token}`);

			expect(res.statusCode).toBe(200);
		});
	});

	describe("Get", () => {
		it("Should be 404 (Not found)", async () => {
			const res = await supertest(app)
				.get(`/api/board/${invalidBoardId}`)
				.set("Authorization", `Bearer ${token}`);

			expect(res.statusCode).toBe(404);
		});

		it("Should be 401 (Unauthorized)", async () => {
			const res = await supertest(app)
				.get(`/api/board/${sampleBoardId}`);

			expect(res.statusCode).toBe(401);
		});

		it("Should have valid body", async () => {
			const res = await supertest(app)
				.get(`/api/board/${sampleBoardId}`)
				.set("Authorization", `Bearer ${token}`);

			expect(res.statusCode).toBe(200);
			expect(res.body.title).toBe(sampleBoard.title);
			expect(res.body.id).toBe(sampleBoardId);
			expect(res.body.users).toEqual([{...sampleUser, password: undefined, isOwner: true}]);
			expect(res.body.lists.length).toBe(3);
		});
	});

	describe("Update", () => {
		it("Should be 404 (Not found)", async () => {
			const res = await supertest(app)
				.put("/api/board")
				.send({boardId: invalidBoardId})
				.set("Authorization", `Bearer ${token}`);

			expect(res.statusCode).toBe(404);
		});

		it("Should be 401 (Unauthorized)", async () => {
			const res = await supertest(app)
				.put("/api/board");

			expect(res.statusCode).toBe(401);
		});

		it("Should be 400 (Bad request)", async () => {
			const res = await supertest(app)
				.put("/api/board")
				.send({boardId: sampleBoardId, title: undefined})
				.set("Authorization", `Bearer ${token}`);

			expect(res.statusCode).toBe(400);
		});

		it("Should be 200 (OK)", async () => {
			const res = await supertest(app)
				.put("/api/board")
				.send(sampleBoard)
				.set("Authorization", `Bearer ${token}`);

			expect(res.statusCode).toBe(200);
		});
	});

	describe("Lists", () => {
		describe("Create", () => {
			it("Should be 404 (Not found)", async () => {
				const res = await supertest(app)
					.post("/api/board/list")
					.send({boardId: invalidBoardId})
					.set("Authorization", `Bearer ${token}`);

				expect(res.statusCode).toBe(404);
			});

			it("Should be 401 (Unauthorized)", async () => {
				const res = await supertest(app)
					.post("/api/board/list");

				expect(res.statusCode).toBe(401);
			});

			it("Should be 400 (Bad request)", async () => {
				const res = await supertest(app)
					.post("/api/board/list")
					.send({boardId: sampleBoardId, ...invalidList})
					.set("Authorization", `Bearer ${token}`);

				expect(res.statusCode).toBe(400);
			});

			it("Should be 200 (OK)", async () => {
				const res = await supertest(app)
					.post("/api/board/list")
					.send({boardId: sampleBoardId, ...sampleList})
					.set("Authorization", `Bearer ${token}`);

				expect(res.statusCode).toBe(200);
			});
		});

		describe("Update", () => {
			it("Should be 404 (Not found)", async () => {
				const res = await supertest(app)
					.put("/api/board/list")
					.send({boardId: invalidBoardId, ...sampleList})
					.set("Authorization", `Bearer ${token}`);

				expect(res.statusCode).toBe(404);
			});

			it("Should be 401 (Unauthorized)", async () => {
				const res = await supertest(app)
					.put("/api/board/list");

				expect(res.statusCode).toBe(401);
			});

			it("Should be 400 (Bad request)", async () => {
				const res = await supertest(app)
					.put("/api/board/list")
					.send({boardId: sampleBoardId, ...invalidList})
					.set("Authorization", `Bearer ${token}`);

				expect(res.statusCode).toBe(400);
			});

			it("Should be 200 (OK)", async () => {
				const res = await supertest(app)
					.put("/api/board/list")
					.send({boardId: sampleBoardId, ...sampleList})
					.set("Authorization", `Bearer ${token}`);

				expect(res.statusCode).toBe(200);
			});
		});

		describe("Delete", () => {
			it("Should be 404 (Not found)", async () => {
				const invalidListId = "invalid_list_id";

				const res = await supertest(app)
					.delete(`/api/board/list/${invalidBoardId}/${invalidListId}`)
					.set("Authorization", `Bearer ${token}`);

				expect(res.statusCode).toBe(404);
			});

			it("Should be 401 (Unauthorized)", async () => {
				const res = await supertest(app)
					.delete(`/api/board/list/${invalidBoardId}/${sampleList.id}`);

				expect(res.statusCode).toBe(401);
			});

			it("Should be 200 (OK)", async () => {
				const res = await supertest(app)
					.delete(`/api/board/list/${sampleBoardId}/${sampleList.id}`)
					.set("Authorization", `Bearer ${token}`);

				expect(res.statusCode).toBe(200);
			});
		});
	});

	describe("Users", () => {
		describe("Create", () => {
			it("Should be 401 (Unauthorized)", async () => {
				const res = await supertest(app)
					.post("/api/board/user");

				expect(res.statusCode).toBe(401);
			});

			it("Should be 400 (Bad request)", async () => {
				const res = await supertest(app)
					.post("/api/board/user")
					.send({boardId: sampleBoardId, username: undefined})
					.set("Authorization", `Bearer ${token}`);

				expect(res.statusCode).toBe(400);
			});

			it("Should be 200 (OK)", async () => {
				const res = await supertest(app)
					.post("/api/board/user")
					.send({boardId: sampleBoardId, username: "CARD_USER"})
					.set("Authorization", `Bearer ${token}`);

				expect(res.statusCode).toBe(200);
			});
		});

		describe("Update", () => {
			it("Should be 404 (Not found)", async () => {
				const res = await supertest(app)
					.put("/api/board/user")
					.send({boardId: invalidBoardId})
					.set("Authorization", `Bearer ${token}`);

				expect(res.statusCode).toBe(404);
			});

			it("Should be 401 (Unauthorized)", async () => {
				const res = await supertest(app)
					.put("/api/board/user");

				expect(res.statusCode).toBe(401);
			});

			it("Should be 400 (Bad request)", async () => {
				const res = await supertest(app)
					.put("/api/board/user")
					.send({boardId: sampleBoardId, isOwner: "should be bool"})
					.set("Authorization", `Bearer ${token}`);

				expect(res.statusCode).toBe(400);
			});

			it("Should be 200 (OK)", async () => {
				const res = await supertest(app)
					.put("/api/board/user")
					.send({boardId: sampleBoardId, username: sampleUser.username, isOwner: true})
					.set("Authorization", `Bearer ${token}`);

				expect(res.statusCode).toBe(200);
			});
		});

		describe("Delete", () => {
			it("Should be 404 (Not found)", async () => {
				const res = await supertest(app)
					.delete(`/api/board/user/${invalidBoardId}/${sampleUser.username}`)
					.set("Authorization", `Bearer ${token}`);

				expect(res.statusCode).toBe(404);
			});

			it("Should be 401 (Unauthorized)", async () => {
				const res = await supertest(app)
					.delete(`/api/board/user/${sampleBoardId}/${sampleUser.username}`);

				expect(res.statusCode).toBe(401);
			});

			it("Should be 200 (OK)", async () => {
				const res = await supertest(app)
					.delete(`/api/board/user/${sampleBoardId}/CARD USER`)
					.set("Authorization", `Bearer ${token}`);

				expect(res.statusCode).toBe(200);
			});
		});
	});

	describe("Delete", () => {
		it("Should be 404 (Not found)", async () => {
			const res = await supertest(app)
				.delete(`/api/board/${invalidBoardId}`)
				.set("Authorization", `Bearer ${token}`);

			expect(res.statusCode).toBe(404);
		});

		it("Should be 401 (Unauthorized)", async () => {
			const res = await supertest(app)
				.delete(`/api/board/${sampleBoardId}`);

			expect(res.statusCode).toBe(401);
		});

		it("Should be 200 (OK)", async () => {
			const res = await supertest(app)
				.delete(`/api/board/${sampleBoardId}`)
				.set("Authorization", `Bearer ${token}`);

			expect(res.statusCode).toBe(200);
		});
	});
});
