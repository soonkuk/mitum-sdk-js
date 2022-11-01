import { IBytes } from "./interface.js";
import { assert, EC_INVALID_TOKEN, InvalidTypeError } from "./error.js";

export class Token extends IBytes {
	constructor(token) {
		assert(
			typeof token === "string",
			new InvalidTypeError("not string", EC_INVALID_TOKEN, typeof token)
		);

		this.s = token;
	}

	bytes() {
		return Buffer.from(this.s);
	}

	toString() {
		return Buffer.from(this.s, "utf8").toString("base64");
	}
}
