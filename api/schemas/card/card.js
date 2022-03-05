module.exports = [
	{$ref: "card"},
	{
		card: {
			$id: "card",
			type: "object",
			properties: {
				title: {
					type: "string",
					minLength: 1,
					maxLength: 64,
				},
				id: {
					type: "string",
					format: "uuid",
				},
				listId: {
					type: "string",
					format: "uuid",
				},
				description: {
					type: "string",
					maxLength: 2000,
				},
				assigned: {
					type: "array",
					items: {
						type: "string",
						minLength: 4,
						maxLength: 25,
					},
				},
				files: {
					type: "array",
					items: {
						properties: {
							filename: {
								type: "string",
								minLength: 1,
								maxLength: 30,
							},
							url: {
								type: "string",
							},
						},
						required: ["filename", "url"],
						additionalProperties: false,
						type: "object",
					},
					maxItems: 10,
				},
				images: {
					type: "array",
					items: {
						type: "string",
					},
					maxItems: 10,
				},
			},
			required: ["title", "description", "assigned", "files", "images", "id", "listId"],
			additionalProperties: false,
		},
	},
];