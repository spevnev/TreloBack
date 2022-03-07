const crypto = require("crypto");

const hash = async password => new Promise((resolve, reject) => {
	const salt = crypto.randomBytes(16).toString("hex");

	crypto.scrypt(password, salt, 64, (err, res) => {
		if (err) reject(err);
		resolve(salt + "::" + res.toString("hex"));
	});
});

const verify = async (password, hash) => new Promise((resolve, reject) => {
	const [salt, key] = hash.split("::");

	crypto.scrypt(password, salt, 64, (err, res) => {
		if (err) reject(err);
		resolve(key == res.toString("hex"));
	});
});

module.exports = {hash, verify};