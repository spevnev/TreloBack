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
		list: {
			properties: {
				id: {
					type: "string",
					format: "uuid",
				},
				title: {
					type: "string",
					minLength: 1,
					maxLength: 30,
				},
				order: {
					type: "number",
					minimum: 0,
				},
			},
			required: ["id", "title", "order"],
			additionalProperties: false,
			type: "object",
		},
	},
	required: ["boardId", "socketId", "list"],
	additionalProperties: false,
	type: "object",
});