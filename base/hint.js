import { assert, EC_INVALID_HINT, InvalidTypeError } from "./error.js";
import { v } from "../mitum.config.js";

export class Hint {
	constructor(hint) {
		assert(
			typeof hint === "string",
			new InvalidTypeError("not string", EC_INVALID_HINT, typeof hint)
		);
		this.s = hint;
	}

	toString() {
		return this.s + "-" + v;
	}
}
