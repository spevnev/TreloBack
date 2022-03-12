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
		socketId: {
			type: "string",
			minLength: 1,
		},
		files: {
			type: "array",
			items: {
				properties: {
					url: {
						type: "string",
					},
					filename: {
						type: "string",
						minLength: 1,
						maxLength: 32,
					},
				},
				required: ["filename", "url"],
				additionalProperties: false,
				type: "object",
			},
		},
	},
	required: ["boardId", "socketId", "cardId", "files"],
	additionalProperties: false,
	type: "object",
});