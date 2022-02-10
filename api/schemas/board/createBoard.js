const [type, def] = require("./board");

module.exports = new (require("ajv"))().compile({
	$async: true,
	properties: {
		board: type,
	},
	definitions: def,
	required: ["board"],
	additionalProperties: false,
	type: "object",
});