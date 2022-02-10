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
	},
	required: ["username", "password"],
	additionalProperties: false,
	type: "object",
});