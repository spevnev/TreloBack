module.exports = new (require("ajv"))().compile({
	$async: true,
	properties: {
		username: {
			type: "string",
			minLength: 4,
			maxLength: 25,
		},
		password: {
			type: "string",
			minLength: 4,
			maxLength: 64,
		},
	},
	required: ["username", "password"],
	additionalProperties: false,
	type: "object",
});