const [type, def] = require("./board");

module.exports = new (require("ajv"))().compile({
	$async: true,
	properties: {
		boards: {
			type: "array",
			items: type,
		},
	},
	definitions: def,
	required: [],
	additionalProperties: false,
	type: "object",
});