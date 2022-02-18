const ajv = new (require("ajv"))();
require("ajv-formats")(ajv, ["uuid"]);

module.exports = ajv.compile({
	$async: true,
	properties: {
		boardId: {
			type: "string",
			format: "uuid",
		},
		cardId: {
			type: "string",
			format: "uuid",
		},
		files: {
			type: "array",
			items: {
				properties: {
					id: {
						type: "string",
						format: "uuid",
					},
					filename: {
						type: "string",
						minLength: 1,
					},
				},
				required: ["filename", "id"],
				additionalProperties: false,
				type: "object",
			},
		},
	},
	required: ["boardId", "cardId", "files"],
	additionalProperties: false,
	type: "object",
});