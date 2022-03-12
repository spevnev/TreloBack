const supertest = require("supertest");
const {randomUUID} = require("crypto");
const axios = require("axios");

const app = require("../src/app")();


const sampleImage = "https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black-thumbnail.png";

const sampleUser = {username: "AUTH_USER", password: "TEST_PASSWORD", icon: randomUUID()};


describe("Auth", () => {
	let file = null;

	beforeAll(async () => {
		// File data
		const res = await axios.get(sampleImage, {responseType: "arraybuffer"});
		file = `data:image/${sampleImage.split(".").slice(-1)};base64,` + Buffer.from(res.data, "binary").toString("base64");
		expect(file).toBeDefined();
	});

	describe("Icon", () => {
		it("Should be 400 (Bad request)", async () => {
			const res = await supertest(app)
				.post("/api/auth/icon")
				.send({icon: undefined});

			expect(res.statusCode).toBe(400);
		});

		it("Should have valid body", async () => {
			const res = await supertest(app)
				.post("/api/auth/icon")
				.send({icon: file});

			expect(res.statusCode).toBe(200);
			expect(typeof res.body.url).toBe("string");
		});
	});

	describe("Signup", () => {
		it("Should be 400 (Bad request)", async () => {
			const res = await supertest(app)
				.post("/api/auth/signup")
				.send({...sampleUser, username: undefined});

			expect(res.statusCode).toBe(400);
		});

		it("Should have valid body", async () => {
			const res = await supertest(app)
				.post("/api/auth/signup")
				.send(sampleUser);

			expect(res.statusCode).toBe(200);
			expect(res.body[0]).toBeFalsy();
			expect(res.body[1].token.length).toBeGreaterThanOrEqual(64);
			expect(res.body[1].user).toEqual({...sampleUser, password: undefined});
		});

		it("Should have error inside of a body", async () => {
			// This should run after the test above and if so, then db already contains sampleUser and the exception will be raised, because of duplicate usernames and icons
			const res = await supertest(app)
				.post("/api/auth/signup")
				.send(sampleUser);

			expect(res.statusCode).toBe(200);
			expect(typeof res.body[0]).toBe("string");
			expect(res.body[1]).toBeFalsy();
		});
	});

	describe("Login", () => {
		it("Should be 400 (Bad request)", async () => {
			const res = await supertest(app)
				.post("/api/auth/login");

			expect(res.statusCode).toBe(400);
		});

		it("Should have error inside of a body", async () => {
			const res = await supertest(app)
				.post("/api/auth/login")
				.send({username: sampleUser.username, password: "incorrect_password"});

			expect(res.statusCode).toBe(200);
			expect(typeof res.body[0]).toBe("string");
			expect(res.body[1]).toBeFalsy();
		});

		it("Should have valid body", async () => {
			const res = await supertest(app)
				.post("/api/auth/login")
				.send({...sampleUser, icon: undefined});

			expect(res.statusCode).toBe(200);
			expect(res.body[0]).toBeFalsy();
			expect(res.body[1].token.length).toBeGreaterThanOrEqual(64);
			expect(res.body[1].user).toEqual({...sampleUser, password: undefined});
		});
	});
});
