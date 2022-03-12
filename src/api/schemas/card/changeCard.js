const [type, def] = require("./card");
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
		card: type,
	},
	definitions: def,
	required: ["boardId", "socketId", "card"],
	additionalProperties: false,
	type: "object",
});