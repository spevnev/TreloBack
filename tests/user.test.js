const supertest = require("supertest");
const {addBoard} = require("../src/db/board");
const {randomUUID} = require("crypto");

const app = require("../src/app")();


const sampleUser = {username: "USER_USER", password: "TEST_PASSWORD", icon: randomUUID()};

const sampleBoardId = randomUUID();


describe("User", () => {
	let token = null;

	beforeAll(async () => {
		// Signing up
		let res = await supertest(app)
			.post(`/api/auth/signup`)
			.send(sampleUser);

		token = res.body[1].token;
		expect(typeof token).toBe("string");

		// Creating board
		const success = await addBoard("sample board", sampleBoardId, sampleUser.username);
		expect(success).toBeTruthy();
	});

	describe("Get", () => {
		it("Should be 401 (Unauthorized)", async () => {
			const res = await supertest(app)
				.get("/api/user");

			expect(res.statusCode).toBe(401);
		});

		it("Should have valid body", async () => {
			const res = await supertest(app)
				.get("/api/user")
				.set("Authorization", `Bearer ${token}`);

			expect(res.statusCode).toBe(200);
			expect(res.body[0]).toBeFalsy();
			expect(res.body[1]).toEqual({boards: [{id: sampleBoardId, isFavourite: false, isOwner: true, title: "sample board"}], ...sampleUser, password: undefined});
		});
	});

	describe("Change favourite", () => {
		it("Should be 401 (Unauthorized)", async () => {
			const res = await supertest(app)
				.put("/api/user/favourite")
				.send({boardId: sampleBoardId, isFavourite: true});

			expect(res.statusCode).toBe(401);
		});

		it("Should be 400 (Bad request)", async () => {
			const res = await supertest(app)
				.put("/api/user/favourite")
				.send({boardId: sampleBoardId})
				.set("Authorization", `Bearer ${token}`);

			expect(res.statusCode).toBe(400);
		});

		it("Should be 200 (OK)", async () => {
			const res = await supertest(app)
				.put("/api/user/favourite")
				.send({boardId: sampleBoardId, isFavourite: true})
				.set("Authorization", `Bearer ${token}`);

			expect(res.statusCode).toBe(200);
		});
	});
});
