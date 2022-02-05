const jwt = require("jsonwebtoken");

const JWT_KEY = "3206116208b1679787b89e8a2a9965a8d2f69bf0e5e2b646bd245700bda0218c";
const expiresSec = 60 * 60 * 24; // day

const createJwt = data => new Promise((resolve, reject) => {
	jwt.sign({...data, exp: Math.round(Date.now() / 1000) + expiresSec}, JWT_KEY, {}, (err, token) => {
		if (token) resolve(token);
		if (err) reject(err);
	});
});

const verifyJwt = token => new Promise((resolve, reject) => {
	jwt.verify(token, JWT_KEY, {}, (err, res) => {
		if (res) resolve([null, res]);
		if (err) resolve([err]);
	});
});

module.exports = {verifyJwt, createJwt};