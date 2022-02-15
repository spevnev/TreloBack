const [type, def] = require("./icon");

module.exports = [
	{$ref: "board"},
	{
		board: {
			$id: "board",
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
				lists: {
					type: "array",
					items: {
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
						},
						required: ["title", "id"],
						additionalProperties: false,
						type: "object",
					},
				},
				users: {
					type: "array",
					items: {
						properties: {
							username: {
								type: "string",
								minLength: 4,
								maxLength: 25,
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