import bs58 from "bs58";
import * as secp256k1 from "@noble/secp256k1";
import { getPublicCompressed } from "eccrypto-js";

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

import { Key } from "./key.js";
import { isPrivateKey } from "./util.js";

import Big from "../utils/big.js";
import { sum256 } from "../utils/hash.js";
import { jsonStringify } from "../utils/json.js";

export class KeyPair {
	constructor(priv) {
		if (!priv instanceof Key) {
			throw new InvalidInstanceError(
				"not Key instance",
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
			"not string",
			EC_INVALID_PRIVATE_KEY,
			typeof priv
		);
	}

	if (!isPrivateKey(priv)) {
		throw new InvalidFormatError(
			"invalid length or key suffix",
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
			"not string",
			EC_INVALID_SEED,
			typeof seed
		);
	}

	if (seed.length < MinSeedLength) {
		throw new InvalidLengthError(
			"seed length out of range",
			EC_INVALID_SEED,
			seed.length
		);
	}

	seed = Buffer.from(bs58.encode(sum256(Buffer.from(seed))));
	seed = seed.subarray(0, seed.length - (seed.length < 44 ? 3 : 4));

	const N = secp256k1.CURVE.n - BigInt(1);
	let k = new Big(seed).big;
	k %= N;
	k += BigInt(1);

	return new KeyPair(
		new Key(
			bs58.encode(secp256k1.utils.hexToBytes(k.toString(16))) +
				SUFFIX_KEY_PRIVATE
		)
	);
};
