const supertest = require("supertest");
const {addBoard} = require("../src/db/board");
const {randomUUID} = require("crypto");
const axios = require("axios");

const app = require("../src/server")();


const sampleImage = "https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black-thumbnail.png";

const sampleUser = {username: "FILE_USER", password: "TEST_PASSWORD", icon: randomUUID()};

const sampleBoardId = randomUUID();
const invalidBoardId = "invalid_board_id";


describe("File", () => {
	let token = null;
	let file = null;

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

		// Fetching file data
		res = await axios.get(sampleImage, {responseType: "arraybuffer"});
		file = `data:image/${sampleImage.split(".").slice(-1)};base64,` + Buffer.from(res.data, "binary").toString("base64");
		expect(file).toBeDefined();
	});

	describe("Upload", () => {
		it("Should be 404 (Not found)", async () => {
			const res = await supertest(app)
				.post(`/api/file/upload`)
				.send({boardId: invalidBoardId, files: []})
				.set("Authorization", `Bearer ${token}`);

			expect(res.statusCode).toBe(404);
		});

		it("Should be 401 (Unauthorized)", async () => {
			const res = await supertest(app)
				.post(`/api/file/upload`);

			expect(res.statusCode).toBe(401);
		});

		it("Should be 400 (Bad request)", async () => {
			const res = await supertest(app)
				.post(`/api/file/upload`)
				.send({boardId: sampleBoardId})
				.set("Authorization", `Bearer ${token}`);

			expect(res.statusCode).toBe(400);
		});

		it("Should have error inside of a body", async () => {
			const invalidFile = "not-a-base64-file";

			const res = await supertest(app)
				.post(`/api/file/upload`)
				.send({boardId: sampleBoardId, files: [invalidFile]})
				.set("Authorization", `Bearer ${token}`);

			expect(res.statusCode).toBe(200);
			expect(res.body[0].errno).toBeDefined();
			expect(res.body[1]).toBeFalsy();
		});

		it("Should have valid body", async () => {
			const res = await supertest(app)
				.post(`/api/file/upload`)
				.send({boardId: sampleBoardId, files: [file]})
				.set("Authorization", `Bearer ${token}`);

			expect(res.statusCode).toBe(200);
			expect(res.body[0]).toBeFalsy();
			expect(typeof res.body[1]).toEqual("object");
			expect(res.body[1].length).toBeGreaterThan(0);
		});
	});
});
