const { Hint } = require("../base/hint.js");
const { IBytesDict } = require("../base/interface.js");

class Item extends IBytesDict {
	constructor(hint) {
		super();
		this.hint = new Hint(hint);
	}

    toString() {
        throw error.nimplement(
			EC_NOT_IMPLEMENTED_DICT,
			"unimplemented method toString()"
		);
    }
}
exports.Item = Item