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
		icon: {
			type: "object",
			properties: {
				data: {
					type: "string",
					minLength: 1,
				},
				ext: {
					type: "string",
					minLength: 1,
				},
			},
			required: ["data", "ext"],
			additionalProperties: false,
		},
	},
	required: ["username", "password"],
	additionalProperties: false,
	type: "object",
});