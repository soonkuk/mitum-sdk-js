import bs58 from "bs58";

import { hmac } from "@noble/hashes/hmac";
import { sha256 } from "@noble/hashes/sha256";
import * as secp256k1 from "@noble/secp256k1";

import secureRandom from "secure-random";
import { getPublicCompressed } from "eccrypto-js";

import { MIN_SEED_LENGTH, SUFFIX_LENGTH } from "../mitum.config.js";
import { SUFFIX_KEY_PRIVATE, SUFFIX_KEY_PUBLIC } from "../alias/key.js";

import {
	assert,
	EC_INVALID_PRIVATE_KEY,
	EC_INVALID_SEED,
	InvalidFormatError,
	InvalidRangeError,
	InvalidTypeError,
} from "../base/error.js";

import Big from "../utils/big.js";
import { sum256 } from "../utils/hash.js";
import { jsonStringify } from "../utils/json.js";

import { Key } from "./key.js";
import { KeyPair } from "./keypair.js";
import { isSchnorrPrivateKey } from "./validation.js";

class SchnorrKeyPair extends KeyPair {
	constructor(privateKey) {
		super(privateKey);
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

	_generateSigner() {
		return bs58.decode(this.privateKey.key);
	}

	sign(msg) {
		secp256k1.utils.hmacSha256Sync = (key, ...msgs) =>
			hmac(sha256, key, secp256k1.utils.concatBytes(...msgs));
		secp256k1.utils.sha256Sync = (...msgs) =>
			sha256(secp256k1.utils.concatBytes(...msgs));
		return secp256k1.signSync(sha256(sha256(msg)), this.signer);
	}
}

const random = () => {
	return new SchnorrKeyPair(
		new Key(
			bs58.encode(Buffer.from(secureRandom(32, { type: "Uint8Array" }))) +
				SUFFIX_KEY_PRIVATE
		)
	);
};

const fromPrivateKey = (privateKey) => {
	assert(
		typeof privateKey === "string",
		new InvalidTypeError(
			"not string",
			EC_INVALID_PRIVATE_KEY,
			typeof privateKey
		)
	);
	assert(
		isSchnorrPrivateKey(privateKey),
		new InvalidFormatError(
			"invalid length or key suffix",
			EC_INVALID_PRIVATE_KEY,
			jsonStringify({
				length: privateKey.length,
				suffix:
					privateKey.length >= SUFFIX_LENGTH
						? privateKey.substring(
								privateKey.length - SUFFIX_LENGTH
						  )
						: null,
			})
		)
	);

	return new SchnorrKeyPair(new Key(privateKey));
};

const fromSeed = (seed) => {
	assert(
		typeof seed === "string",
		new InvalidTypeError("not string", EC_INVALID_SEED, typeof seed)
	);
	assert(
		seed.length >= MIN_SEED_LENGTH,
		new InvalidRangeError(
			"seed length out of range",
			EC_INVALID_SEED,
			seed.length
		)
	);

	seed = Buffer.from(bs58.encode(sum256(Buffer.from(seed))));
	seed = seed.subarray(0, seed.length - (seed.length < 44 ? 3 : 4));

	const N = secp256k1.CURVE.n - BigInt(1);
	let k = new Big(seed).big;
	k %= N;
	k += BigInt(1);

	return new SchnorrKeyPair(
		new Key(
			bs58.encode(secp256k1.utils.hexToBytes(k.toString(16))) +
				SUFFIX_KEY_PRIVATE
		)
	);
};

export const schnorr = {
	random,
	fromPrivateKey,
	fromSeed,
};
