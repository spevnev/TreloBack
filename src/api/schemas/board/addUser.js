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
		username: {
			type: "string",
			minLength: 4,
			maxLength: 25,
		},
	},
	required: ["boardId", "socketId", "username"],
	additionalProperties: false,
	type: "object",
});