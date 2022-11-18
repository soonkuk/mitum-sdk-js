import { IBytes } from "./interface.js";
import { assert, error, EC_INVALID_TOKEN } from "./error.js";

export class Token extends IBytes {
	constructor(s) {
		super();
		assert(
			typeof s === "string",
			error.type("not string", EC_INVALID_TOKEN, typeof s)
		);
		this.s = s;
	}

	bytes() {
		return Buffer.from(this.s);
	}

	toString() {
		return Buffer.from(this.s, "utf8").toString("base64");
	}
}
