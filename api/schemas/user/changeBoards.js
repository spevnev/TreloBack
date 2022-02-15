const [type, def] = require("./board");
const ajv = new (require("ajv"))();
require("ajv-formats")(ajv, ["uuid"]);

module.exports = ajv.compile({
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