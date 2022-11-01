import bs58 from "bs58";

import {
	assert,
	EC_INVALID_KEY_PAIR,
	EC_NOT_IMPLEMENTED_METHOD,
	InvalidInstanceError,
	NotImplementedError,
} from "../base/error.js";

import { name } from "../utils/string.js";

import { Key } from "./key.js";

export class KeyPair {
	constructor(privateKey) {
		assert(
			privateKey instanceof Key,
			new InvalidInstanceError(
				"not Key instance",
				EC_INVALID_KEY_PAIR,
				name(privateKey)
			)
		);

		this.privateKey = privateKey;
		this.publicKey = new Key(this._generatePublicKey());
		this.signer = bs58.decode(privateKey.key);
	}

	_generatePublicKey() {
		throw new NotImplementedError(
			"unimplemented method _generatePublicKey()",
			EC_NOT_IMPLEMENTED_METHOD,
			"KeyPair"
		);
	}

	sign(_) {
		throw new NotImplementedError(
			"unimplemented method sign()",
			EC_NOT_IMPLEMENTED_METHOD,
			"KeyPair"
		);
	}
}
