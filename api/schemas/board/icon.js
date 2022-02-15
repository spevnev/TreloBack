module.exports = [
	{$ref: "userIcon"},
	{
		icon: {
			$id: "userIcon",
			properties: {
				ext: {
					type: "string",
					minLength: 1,
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
];