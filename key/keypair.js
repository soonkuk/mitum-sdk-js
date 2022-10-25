import bs58 from "bs58";
import * as secp256k1 from "@noble/secp256k1";
import { getPublicCompressed } from "eccrypto-js";

import { IBytes } from "../base/interface.js";
import { SUFFIX_KEY_PRIVATE, SUFFIX_KEY_PUBLIC } from "../alias/key.js";
import {
	EC_INVALID_KEY_PAIR,
	EC_INVALID_PRIVATE_KEY,
	EC_INVALID_SEED,
	InvalidFormatError,
	InvalidInstanceError,
	InvalidLengthError,
	InvalidTypeError,
} from "../error.js";

import {
	bufToBig,
	isKey,
	isKeySuffix,
	isPrivateKey,
	parseKey,
} from "./util.js";
import { sum256 } from "../utils/hash.js";
import { jsonStringify } from "../utils/json.js";

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
				getPublicCompressed(
					Buffer.from(bs58.decode(this.privateKey.key))
				)
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
	if (typeof priv !== "string") {
		throw new InvalidTypeError(
			"invalid string private key",
			EC_INVALID_PRIVATE_KEY,
			typeof priv
		);
	}

	if (!isPrivateKey(priv)) {
		throw new InvalidFormatError(
			"invalid private key",
			EC_INVALID_PRIVATE_KEY,
			jsonStringify({
				length: priv.length,
				suffix:
					priv.length >= 3 ? priv.substring(priv.length - 3) : null,
			})
		);
	}

	return new KeyPair(new Key(priv));
};

const MinSeedLength = 36;

export const fromSeed = (seed) => {
	if (typeof seed != "string") {
		throw new InvalidTypeError(
			"invalid string seed",
			EC_INVALID_SEED,
			typeof seed
		);
	}

	if (seed.length < MinSeedLength) {
		throw new InvalidLengthError(
			"invalid seed length",
			EC_INVALID_SEED,
			seed.length
		);
	}

	seed = Buffer.from(bs58.encode(sum256(Buffer.from(seed))));
	seed = seed.subarray(0, seed.length - (seed.length < 44 ? 3 : 4));

	const N = secp256k1.CURVE.n - BigInt(1);
	let k = bufToBig(seed);
	k %= N;
	k += BigInt(1);

	return new KeyPair(
		new Key(
			bs58.encode(secp256k1.utils.hexToBytes(k.toString(16))) +
				SUFFIX_KEY_PRIVATE
		)
	);
};
