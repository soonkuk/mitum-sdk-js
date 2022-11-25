import bs58 from "bs58";
import bs58check from "bs58check";

import elliptic from "elliptic";
import secureRandom from "secure-random";
import * as secp256k1 from "@noble/secp256k1";
import { getPublicCompressed } from "eccrypto-js";

import { Key } from "./key.js";
import { KeyPair } from "./keypair.js";

import { MIN_SEED_LENGTH } from "../mitum.config.js";
import { SUFFIX_KEY_PRIVATE, SUFFIX_KEY_PUBLIC } from "../alias/key.js";

import { assert, error, EC_INVALID_SEED } from "../base/error.js";

import { Big } from "../utils/number.js";
import { sha256, sum256 } from "../utils/hash.js";

class ECDSAKeyPair extends KeyPair {
	constructor(privateKey) {
		super(privateKey);
	}

	_PKDecoded() {
		let dk = bs58check.decode(this.privateKey.key);
		dk = Buffer.from(dk.subarray(1, dk.length - 1));
		return dk;
	}

	_generateSigner() {
		return new elliptic.ec("secp256k1").keyFromPrivate(this._PKDecoded());
	}

	_generatePublicKey() {
		return (
			bs58.encode(getPublicCompressed(this._PKDecoded())) +
			SUFFIX_KEY_PUBLIC
		);
	}

	sign(msg) {
		const b = sha256(sha256(msg));
		const signKey = this.signer.getPrivate("hex");
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
	assert(typeof seed === "string", error.type(EC_INVALID_SEED, "not string"));
	assert(
		seed.length >= MIN_SEED_LENGTH,
		error.range(EC_INVALID_SEED, "seed length out of range")
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
