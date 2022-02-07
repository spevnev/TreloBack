module.exports = new (require("ajv"))().compile({
	$async: true,
	properties: {
		boardId: {
			type: "string",
			minLength: 1,
		},
		cardId: {
			type: "string",
			minLength: 1,
		},
		card: {
			type: "object",
			properties: {
				title: {type: "string", minLength: 1},
				id: {type: "string", minLength: 1},
				listId: {type: "string", minLength: 1},
				description: {type: "string"},
				assigned: {type: "array"},
				files: {type: "array"},
				images: {type: "array"},
			},
			required: ["title", "description", "assigned", "files", "images", "id", "listId"],
			additionalProperties: false,
		},
	},
	required: ["boardId", "cardId", "card"],
	additionalProperties: false,
	type: "object",
});