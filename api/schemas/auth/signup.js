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
		icon: {
			type: "string",
			minLength: 1,
		},
	},
	required: ["username", "password", "icon"],
	additionalProperties: false,
	type: "object",
});