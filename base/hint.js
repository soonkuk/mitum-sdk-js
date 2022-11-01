import { v } from "../mitum.config.js";
import { assert, EC_INVALID_HINT, InvalidTypeError } from "./error.js";

export class Hint {
	constructor(hint) {
		assert(
			typeof typeof hint === "string",
			new InvalidTypeError("not string", EC_INVALID_HINT, typeof hint)
		);
		this.s = hint;
	}

	toString() {
		return this.s + "-" + v;
	}
}
