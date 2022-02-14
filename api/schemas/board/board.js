const [type, def] = require("../user/icon");

module.exports = [
	{$ref: "board"},
	{
		board: {
			$id: "board",
			properties: {
				title: {
					type: "string",
					minLength: 1,
				},
				id: {
					type: "string",
					minLength: 1,
				},
				lists: {
					type: "array",
				},
				users: {
					type: "array",
					items: {
						properties: {
							username: {
								type: "string",
								minLength: 4,
							},
							isOwner: {
								type: "boolean",
							},
							icon: type,
						},
						required: ["username", "isOwner"],
						additionalProperties: false,
						type: "object",
					},
				},
			},
			definitions: def,
			required: ["title", "id", "lists", "users"],
			additionalProperties: false,
			type: "object",
		},
	},
];