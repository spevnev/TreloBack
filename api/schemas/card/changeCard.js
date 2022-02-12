const [type, def] = require("./card");

module.exports = new (require("ajv"))().compile({
	$async: true,
	properties: {
		boardId: {
			type: "string",
			minLength: 1,
		},
		card: type,
	},
	definitions: def,
	required: ["boardId", "card"],
	additionalProperties: false,
	type: "object",
});