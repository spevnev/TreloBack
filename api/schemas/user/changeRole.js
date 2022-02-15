const ajv = new (require("ajv"))();
require("ajv-formats")(ajv, ["uuid"]);

module.exports = ajv.compile({
	$async: true,
	properties: {
		boardId: {
			type: "string",
			format: "uuid",
		},
		isOwner: {
			type: "boolean",
		},
		username: {
			type: "string",
			minLength: 1,
		},
	},
	required: ["boardId", "isOwner", "username"],
	additionalProperties: false,
	type: "object",
});