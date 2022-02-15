module.exports = [
	{$ref: "userBoard"},
	{
		board: {
			$id: "userBoard",
			properties: {
				title: {
					type: "string",
					minLength: 1,
					maxLength: 20,
				},
				id: {
					type: "string",
					format: "uuid",
				},
				isOwner: {
					type: "boolean",
				},
				isFavourite: {
					type: "boolean",
				},
			},
			required: ["title", "id", "isOwner", "isFavourite"],
			additionalProperties: false,
			type: "object",
		},
	},
];