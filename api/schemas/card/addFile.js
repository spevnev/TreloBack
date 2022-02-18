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
		id: {
			type: "string",
			format: "uuid",
		},
		filename: {
			type: "string",
			minLength: 1,
		},
	},
	required: ["boardId", "cardId", "id", "filename"],
	additionalProperties: false,
	type: "object",
});