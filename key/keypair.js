import { Key } from "./key.js";

import {
	assert,
	error,
	EC_INVALID_KEY_PAIR,
	EC_NOT_IMPLEMENTED_METHOD,
} from "../base/error.js";

import { name } from "../utils/string.js";

export class KeyPair {
	constructor(privateKey) {
		assert(
			privateKey instanceof Key,
			error.instance(
				"not Key instance",
				EC_INVALID_KEY_PAIR,
				name(privateKey)
			)
		);

		this.privateKey = privateKey;
		this.publicKey = new Key(this._generatePublicKey());
		this.signer = this._generateSigner();
	}

	_generatePublicKey() {
		throw error.nimplement(
			"unimplemented method _generatePublicKey()",
			EC_NOT_IMPLEMENTED_METHOD,
			"KeyPair"
		);
	}

	_generateSigner() {
		throw error.nimplement(
			"unimplemented method _generateSigner()",
			EC_NOT_IMPLEMENTED_METHOD,
			"KeyPair"
		);
	}

	sign(_) {
		throw error.nimplement(
			"unimplemented method sign()",
			EC_NOT_IMPLEMENTED_METHOD,
			"KeyPair"
		);
	}
}
