const [type, def] = require("./board");
const ajv = new (require("ajv"))();
require("ajv-formats")(ajv, ["uuid"]);

module.exports = ajv.compile({
	$async: true,
	properties: {
		board: type,
		boardId: {
			type: "string",
			format: "uuid",
		},
	},
	definitions: def,
	required: ["board", "boardId"],
	additionalProperties: false,
	type: "object",
});