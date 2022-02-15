const [type, def] = require("./board");
const ajv = new (require("ajv"))();
require("ajv-formats")(ajv, ["uuid"]);

module.exports = ajv.compile({
	$async: true,
	properties: {
		board: type,
	},
	definitions: def,
	required: ["board"],
	additionalProperties: false,
	type: "object",
});