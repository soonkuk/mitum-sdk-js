import { Key } from "./key.js";

import {
	assert,
	EC_INVALID_KEY_PAIR,
	EC_NOT_IMPLEMENTED_METHOD,
	InvalidInstanceError,
	NotImplementedError,
} from "../base/error.js";

import { name } from "../utils/string.js";

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
		this.signer = this._generateSigner();
	}

	_generatePublicKey() {
		throw new NotImplementedError(
			"unimplemented method _generatePublicKey()",
			EC_NOT_IMPLEMENTED_METHOD,
			"KeyPair"
		);
	}

	_generateSigner() {
		throw new NotImplementedError(
			"unimplemented method _generateSigner()",
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
