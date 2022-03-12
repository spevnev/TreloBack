const ajv = new (require("ajv"))();
require("ajv-formats")(ajv, ["uuid"]);

module.exports = ajv.compile({
	$async: true,
	properties: {
		boardId: {
			type: "string",
			format: "uuid",
		},
		socketId: {
			type: "string",
			minLength: 1,
		},
		file: {
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
			required: ["url", "filename"],
			additionalProperties: false,
			type: "object",
		},
	},
	required: ["boardId", "socketId", "file"],
	additionalProperties: false,
	type: "object",
});