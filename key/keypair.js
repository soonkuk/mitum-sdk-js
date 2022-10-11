import * as secp256k1 from "@noble/secp256k1";
import { getPublicCompressed } from "eccrypto-js";
import bs58 from "bs58";

import { IBytes } from "../base/interface.js";
import { SUFFIX_KEY_PRIVATE, SUFFIX_KEY_PUBLIC } from "../alias/key.js";
import {
	EC_INVALID_KEY_PAIR,
	EC_INVALID_PRIVATE_KEY,
	InvalidFormatError,
	InvalidInstanceError,
} from "../error.js";

import { isKey, parseKey } from "./util.js";

export class Key extends IBytes {
	constructor(s) {
		super();
		const { key, suffix } = parseKey(s);
		this.key = key;
		this.suffix = suffix;
	}

	get str() {
		return this.key + this.suffix;
	}

	bytes() {
		return Buffer.from(this.str);
	}
}

export class KeyPair {
	constructor(priv) {
		if (!priv instanceof Key) {
			throw new InvalidInstanceError(
				"invalid instance",
				EC_INVALID_KEY_PAIR,
				priv.constructor.name
			);
		}

		this.privateKey = priv;
		this.publicKey = new Key(this._generatePublicKey());
		this.signer = bs58.decode(priv.key);
	}

	_generatePublicKey() {
		return (
			bs58.encode(
				getPublicCompressed(Buffer.from(bs58.decode(this.privateKey.key)))
			) + SUFFIX_KEY_PUBLIC
		);
	}

	sign(msg) {}
}

export const random = () => {
	return new KeyPair(
		new Key(
			bs58.encode(secp256k1.utils.randomPrivateKey()) + SUFFIX_KEY_PRIVATE
		)
	);
};

export const fromPrivateKey = (priv) => {
	if (!isKey(priv)) {
		throw new InvalidFormatError(
			"invalid private key",
			EC_INVALID_PRIVATE_KEY,
			priv
		);
	}
	return new KeyPair(new Key(priv));
};

export const fromSeed = (seed) => {};
