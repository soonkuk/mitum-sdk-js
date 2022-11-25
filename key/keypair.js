import { Key } from "./key.js";

import {
	assert,
	error,
	EC_INVALID_KEY_PAIR,
	EC_NOT_IMPLEMENTED_METHOD,
} from "../base/error.js";

export class KeyPair {
	constructor(privateKey) {
		assert(
			privateKey instanceof Key,
			error.instance(EC_INVALID_KEY_PAIR, "not Key instance")
		);

		this.privateKey = privateKey;
		this.publicKey = new Key(this._generatePublicKey());
		this.signer = this._generateSigner();
	}

	_generatePublicKey() {
		throw error.nimplement(
			EC_NOT_IMPLEMENTED_METHOD,
			"unimplemented method _generatePublicKey()"
		);
	}

	_generateSigner() {
		throw error.nimplement(
			EC_NOT_IMPLEMENTED_METHOD,
			"unimplemented method _generateSigner()"
		);
	}

	sign(_) {
		throw error.nimplement(
			EC_NOT_IMPLEMENTED_METHOD,
			"unimplemented method sign()"
		);
	}
}
