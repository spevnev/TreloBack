module.exports = [
	{$ref: "card"},
	{
		card: {
			$id: "card",
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
];