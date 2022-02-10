module.exports = [
	{$ref: "userBoard"},
	{
		board: {
			$id: "userBoard",
			properties: {
				title: {type: "string", minLength: 1},
				id: {type: "string", minLength: 1},
				isOwner: {type: "boolean"},
				isFavourite: {type: "boolean"},
			},
			required: ["title", "id", "isOwner", "isFavourite"],
			additionalProperties: false,
			type: "object",
		},
	},
];