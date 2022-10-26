import { IBytes } from "../base/interface.js";
import {
	EC_INVALID_ADDRESS,
	InvalidFormatError,
	InvalidTypeError,
} from "../error.js";

import { Keys, PublicKey } from "./key.js";
import { random } from "./keypair.js";
import { isAddress } from "./util.js";

import { jsonStringify } from "../utils/json.js";

export class Address extends IBytes {
	constructor(s) {
		super();
		if (typeof s !== "string") {
			throw new InvalidTypeError(
				"not string",
				EC_INVALID_ADDRESS,
				typeof s
			);
		}
		if (!isAddress(s)) {
			throw new InvalidFormatError(
				"invalid length or address suffix",
				EC_INVALID_ADDRESS,
				jsonStringify({
					length: s.length,
					suffix: s.length >= 3 ? s.substring(s.length - 3) : null,
				})
			);
		}

		this.s = s;
	}

	bytes() {
		return Buffer.from(this.toString());
	}

	toString() {
		return this.s;
	}
}

export const randomN = (n) => {
	if (typeof n === "number") {
		return nKPs(n);
	}
	return null;
};

const nKPs = (n) => {
	if (n < 1 || n > 10) {
		return null;
	}

	let weight = Math.floor(100 / n);
	if (100 % n) {
		weight += 1;
	}

	const ks = [];
	const kps = [];
	for (let i = 0; i < n; i++) {
		kps.push(random());
		ks.push(new PublicKey(kps[i].publicKey.toString(), weight));
	}

	return {
		keys: new Keys(ks, 100),
		keypairs: kps,
	};
};
