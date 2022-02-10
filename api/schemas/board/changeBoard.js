const [type, def] = require("./board");

module.exports = new (require("ajv"))().compile({
	$async: true,
	properties: {
		board: type,
		boardId: {
			type: "string",
			minLength: 1,
		},
	},
	definitions: def,
	required: ["board", "boardId"],
	additionalProperties: false,
	type: "object",
});