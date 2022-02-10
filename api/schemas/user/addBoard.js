module.exports = new (require("ajv"))().compile({
	$async: true,
	properties: {
		boardId: {
			type: "string",
			minLength: 1,
		},
		username: {
			type: "string",
			minLength: 4,
		},
	},
	required: ["boardId", "username"],
	additionalProperties: false,
	type: "object",
});