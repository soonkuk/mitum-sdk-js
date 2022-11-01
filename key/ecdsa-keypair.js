import { MIN_SEED_LENGTH } from "../mitum.config.js";

import bs58 from "bs58";
import bs58check from "bs58check";

import secureRandom from "secure-random";
import elliptic from "elliptic";
import * as secp256k1 from "@noble/secp256k1";
import { getPublicCompressed } from "eccrypto-js";

import { SUFFIX_KEY_PRIVATE, SUFFIX_KEY_PUBLIC } from "../alias/key.js";
import {
	assert,
	EC_INVALID_SEED,
	InvalidRangeError,
	InvalidTypeError,
} from "../base/error.js";

import { sha256, sum256 } from "../utils/hash.js";
import Big from "../utils/big.js";

import { Key } from "./key.js";
import { KeyPair } from "./keypair.js";

class ECDSAKeyPair extends KeyPair {
	constructor(privateKey) {
		super(privateKey);
	}

	_generatePublicKey() {
		let dk = bs58check.decode(this.privateKey.key);
		dk = Buffer.from(dk.subarray(1, dk.length - 1));
		this.keypair = new elliptic.ec("secp256k1").keyFromPrivate(dk);

		return bs58.encode(getPublicCompressed(dk)) + SUFFIX_KEY_PUBLIC;
	}

	sign(msg) {
		const b = sha256(sha256(msg));
		const signKey = this.keypair.getPrivate("hex");
		const ecurve = new elliptic.ec("secp256k1");

		return Buffer.from(
			ecurve.sign(b, signKey, "hex", { canonical: true }).toDER()
		);
	}
}

const privateKeyfromBuffer = (buf) => {
	const seedHashed = sum256(buf);
	let seedHashedBytes = Buffer.from(bs58.encode(seedHashed));
	seedHashedBytes = seedHashedBytes.subarray(
		0,
		seedHashedBytes.length < 44
			? seedHashedBytes.length - 3
			: seedHashedBytes.length - 4
	);

	const N = secp256k1.CURVE.n - BigInt(1);
	let k = new Big(seedHashedBytes).big;
	k %= N;
	k += BigInt(1);

	const priv = Buffer.from("80" + Buffer.from(k.toString(16)) + "01", "hex");
	const hashedPriv = sha256(sha256(priv));
	const checksum = Buffer.from(hashedPriv.subarray(0, 4));

	return bs58.encode(Buffer.concat([priv, checksum]));
};

const random = () => {
	return fromPrivateKey(
		privateKeyfromBuffer(
			Buffer.from(secureRandom(32, { type: "Uint8Array" }))
		) + SUFFIX_KEY_PRIVATE
	);
};

const fromPrivateKey = (privateKey) => {
	return new ECDSAKeyPair(new Key(privateKey));
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

	return new ECDSAKeyPair(
		new Key(privateKeyfromBuffer(Buffer.from(seed)) + SUFFIX_KEY_PRIVATE)
	);
};

export const ecdsa = {
	random,
	fromPrivateKey,
	fromSeed,
};
