import { Hint } from "../base/hint.js";
import { Token } from "../base/token.js";
import { IBytesDict } from "../base/interface.js";

import { sum256 } from "../utils/hash.js";

export class Fact extends IBytesDict {
	constructor(hint, token) {
        super();
		this.hint = new Hint(hint);
		this.token = new Token(token);
        this.hash = null;
	}

    hashing() {
        return sum256(this.bytes());
    }
}
