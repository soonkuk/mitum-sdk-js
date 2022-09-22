import secp256k1 from "@noble/secp256k1";
import eccrypto from "eccrypto-js";
import bs58 from "bs58";

import { SUFFIX_KEY_PRIVATE, SUFFIX_KEY_PUBLIC } from "../alias/key";
import {
	EC_INVALID_KEY_PAIR,
	EC_INVALID_PRIVATE_KEY,
	InvalidFormatError,
	InvalidInstanceError,
} from "../error";
import { isKey, parseKey } from "./util";

export class Key extends IBytes {
	constructor(s) {
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
	constructor(priv, pub) {
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

		if (!pub instanceof Key) {
			throwInvalidKeypair(pub.constructor.name);
		}

		this.privateKey = priv;
		this.publicKey = pub;
		this.signer = bs58.decode(priv.key);
	}

	_generatePublicKey(priv) {
		return bs58.encode(eccrypto.getPublicCompressed(Buffer.from(priv)));
	}

	random() {
		const priv = secp256k1.randomPrivateKey();
		const spriv = bs58.encode(priv) + SUFFIX_KEY_PRIVATE;
		const spub = this._generatePublicKey(priv) + SUFFIX_KEY_PUBLIC;

		return new KeyPair(new Key(spriv), new Key(spub));
	}

	fromPrivateKey(priv) {
		if (!isKey(priv)) {
			throw new InvalidFormatError(
				"invalid private key",
				EC_INVALID_PRIVATE_KEY,
				priv
			);
		}
		return new KeyPair(
			new Key(priv),
			new Key(
				this._generatePublicKey(
					bs58.decode(priv.substring(0, priv.length - 3))
				) + SUFFIX_KEY_PUBLIC
			)
		);
	}

	fromSeed(seed) {}

	sign(msg) {}
}
