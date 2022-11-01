import {
	MAX_KEYS_IN_ADDRESS,
	MAX_THRESHOLD,
	SUFFIX_LENGTH,
} from "../mitum.config.js";

import { IBytes } from "../base/interface.js";
import {
	assert,
	EC_INVALID_ADDRESS,
	InvalidFormatError,
	InvalidTypeError,
} from "../base/error.js";

import { jsonStringify } from "../utils/json.js";

import { Keys, PublicKey } from "./key.js";
import { schnorr } from "./schnorr-keypair.js";
import { isAddress } from "./util.js";

export class Address extends IBytes {
	constructor(s) {
		super();
		assert(
			typeof s === "string",
			new InvalidTypeError("not string", EC_INVALID_ADDRESS, typeof s)
		);
		assert(
			isAddress(s),
			new InvalidFormatError(
				"invalid length or address suffix",
				EC_INVALID_ADDRESS,
				jsonStringify({
					length: s.length,
					suffix:
						s.length >= SUFFIX_LENGTH
							? s.substring(s.length - SUFFIX_LENGTH)
							: null,
				})
			)
		);

		this.s = s;
	}

	bytes() {
		return Buffer.from(this.toString());
	}

	toString() {
		return this.s;
	}
}

export const schnorrRandomN = (n) => {
	if (typeof n !== "number") {
		return null;
	}

	if (n < 1 || n > MAX_KEYS_IN_ADDRESS) {
		return null;
	}

	let weight = Math.floor(MAX_THRESHOLD / n);
	if (MAX_THRESHOLD % n) {
		weight += 1;
	}

	const ks = [];
	const kps = [];
	for (let i = 0; i < n; i++) {
		kps.push(schnorr.random());
		ks.push(new PublicKey(kps[i].publicKey.toString(), weight));
	}

	return {
		keys: new Keys(ks, MAX_THRESHOLD),
		keypairs: kps,
	};
};

export const ecdsaRandomN = (n) => {};
