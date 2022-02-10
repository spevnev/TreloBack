module.exports = [
	{$ref: "board"},
	{
		board: {
			$id: "board",
			properties: {
				title: {type: "string", minLength: 1},
				id: {type: "string", minLength: 1},
				lists: {type: "array"},
				users: {type: "array"},
			},
			required: ["title", "id", "lists", "users"],
			additionalProperties: false,
			type: "object",
		},
	},
];