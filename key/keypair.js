import * as secp256k1 from "@noble/secp256k1";
import { getPublicCompressed } from "eccrypto-js";
import bs58 from "bs58";

import { SUFFIX_KEY_PRIVATE, SUFFIX_KEY_PUBLIC } from "../alias/key.js";
import {
	EC_INVALID_KEY_PAIR,
	EC_INVALID_PRIVATE_KEY,
	InvalidFormatError,
	InvalidInstanceError,
} from "../error.js";
import { isKey, parseKey } from "./util.js";
import { IBytes } from "../base/interface.js";

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
		const throwInvalidKeypair = (meta) => {
			throw new InvalidInstanceError(
				"invalid instance",
				EC_INVALID_KEY_PAIR,
				meta
			);
		};

		if (!priv instanceof Key) {
			throwInvalidKeypair(priv.constructor.name);
		}

		this.privateKey = priv;
		this.publicKey = new Key(this._generatePublicKey(priv));
		this.signer = bs58.decode(priv.key);
	}

	_generatePublicKey(priv) {
		return (
			bs58.encode(
				getPublicCompressed(Buffer.from(bs58.decode(priv.key)))
			) + SUFFIX_KEY_PUBLIC
		);
	}

	sign(msg) {}
}

export const random = () => {
	const spriv =
		bs58.encode(secp256k1.utils.randomPrivateKey()) + SUFFIX_KEY_PRIVATE;

	return new KeyPair(new Key(spriv));
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
