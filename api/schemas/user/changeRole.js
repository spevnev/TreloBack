module.exports = new (require("ajv"))().compile({
	$async: true,
	properties: {
		boardId: {
			type: "string",
			minLength: 1,
		},
		isOwner: {
			type: "boolean",
		},
		username: {
			type: "string",
			minLength: 1,
		},
	},
	required: ["boardId", "isOwner", "username"],
	additionalProperties: false,
	type: "object",
});