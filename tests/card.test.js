const supertest = require("supertest");
const {addBoard} = require("../db/board");
const {randomUUID} = require("crypto");

const app = require("../server")();


const sampleImage = "https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/512x512/plain/user.png";
const sampleBoardId = randomUUID();
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


describe("Card", () => {
	let token = null;

	beforeAll(async () => {
		// Signing up
		const res = await supertest(app)
			.post(`/api/auth/signup`)
			.send({username: "TEST_USER", password: "TEST_PASSWORD", icon: sampleImage});

		token = res.body[1].token;
		expect(typeof token).toBe("string");

		// Creating board
		const success = await addBoard("sample board", sampleBoardId, "TEST_USER");
		expect(success).toBeTruthy();
	});

	describe("Create", () => {
		test("Should be 401 (Unauthorized)", async () => {
			const res = await supertest(app)
				.post(`/api/card/`);

			expect(res.statusCode).toBe(401);
		});

		test("Should be 404 (Not found)", async () => {
			const res = await supertest(app)
				.post(`/api/card/`)
				.send({boardId: "any board id", card: sampleCard})
				.set("Authorization", `Bearer ${token}`);

			expect(res.statusCode).toBe(404);
		});

		test("Should be 400 (Bad request)", async () => {
			const wrongCard = {...sampleCard, order: -1, images: undefined};

			const res = await supertest(app)
				.post(`/api/card/`)
				.send({boardId: sampleBoardId, card: wrongCard})
				.set("Authorization", `Bearer ${token}`);

			expect(res.statusCode).toBe(400);
		});
	});

	describe("Get", () => {
		test("Should be 401 (Unauthorized)", async () => {
			const res = await supertest(app)
				.get(`/api/card/${sampleBoardId}`);

			expect(res.statusCode).toBe(401);
		});

		test("Should be 404 (Not found)", async () => {
			const res = await supertest(app)
				.get(`/api/card/any_board_id`)
				.set("Authorization", `Bearer ${token}`);

			expect(res.statusCode).toBe(404);
		});
	});
});
