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
				},
				assigned: {
					type: "array",
					items: {
						type: "string",
						minLength: 4,
					},
				},
				files: {
					type: "array",
					items: {
						properties: {
							filename: {
								type: "string",
							},
							id: {
								type: "string",
								format: "uuid",
							},
						},
						required: ["filename", "id"],
						additionalProperties: false,
						type: "object",
					},
				},
				images: {
					type: "array",
					items: {
						properties: {
							ext: {
								type: "string",
							},
							id: {
								type: "string",
								format: "uuid",
							},
						},
						required: ["ext", "id"],
						additionalProperties: false,
						type: "object",
					},
				},
			},
			required: ["title", "description", "assigned", "files", "images", "id", "listId"],
			additionalProperties: false,
		},
	},
];