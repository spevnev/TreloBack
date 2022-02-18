const ajv = new (require("ajv"))();
require("ajv-formats")(ajv, ["uuid"]);

module.exports = ajv.compile({
	$async: true,
	properties: {
		boardId: {
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
			maxLength: 30,
		},
	},
	required: ["boardId", "id", "filename"],
	additionalProperties: false,
	type: "object",
});