module.exports = new (require("ajv"))().compile({
	$async: true,
	properties: {
		username: {
			type: "string",
			minLength: 4,
		},
		password: {
			type: "string",
			minLength: 4,
		},
		userIcon: {
			type: "string",
			minLength: 1,
		},
	},
	required: ["username", "password"],
	additionalProperties: false,
	type: "object",
});