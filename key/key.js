import bs58 from "bs58";

import { Address } from "./address.js";
import { parseKey } from "./validation.js";

import {
	MAX_KEYS_IN_ADDRESS,
	MAX_THRESHOLD,
	MAX_WEIGHT,
	MIN_THRESHOLD,
	MIN_WEIGHT,
} from "../mitum.config.js";
import { HINT_KEY, HINT_KEYS, SUFFIX_ACCOUNT_ADDRESS } from "../alias/key.js";

import { Hint } from "../base/hint.js";
import { IBytes, IBytesDict } from "../base/interface.js";
import {
	assert,
	EC_INVALID_KEYS,
	EC_INVALID_THRESHOLD,
	EC_INVALID_WEIGHT,
	InvalidInstanceError,
	InvalidRangeError,
	InvalidTypeError,
} from "../base/error.js";

import Big from "../utils/big.js";
import { sum256 } from "../utils/hash.js";
import { jsonStringify } from "../utils/json.js";
import { name, sortStringAsBuf } from "../utils/string.js";

export class Key extends IBytes {
	constructor(s) {
		super();
		const { key, suffix } = parseKey(s);
		this.key = key;
		this.suffix = suffix;
	}

	toString() {
		return this.key + this.suffix;
	}

	bytes() {
		return Buffer.from(this.toString());
	}
}

export class PublicKey extends Key {
	constructor(s, weight) {
		super(s);
		assert(
			typeof weight === "number",
			new InvalidTypeError("not number", EC_INVALID_WEIGHT, typeof weight)
		);
		assert(
			weight >= MIN_WEIGHT && weight <= MAX_WEIGHT,
			new InvalidRangeError(
				"weight out of range",
				EC_INVALID_WEIGHT,
				weight
			)
		);
		this.hint = new Hint(HINT_KEY);
		this.weight = new Big(weight);
	}

	bytes() {
		return Buffer.concat([super.bytes(), this.weight.fillBytes()]);
	}

	dict() {
		return {
			_hint: this.hint.toString(),
			weight: this.weight.v,
			key: this.toString(),
		};
	}
}

export class Keys extends IBytesDict {
	constructor(keys, threshold) {
		super();
		assert(
			typeof threshold === "number",
			new InvalidTypeError(
				"not number",
				EC_INVALID_THRESHOLD,
				typeof threshold
			)
		);
		assert(
			threshold >= MIN_THRESHOLD && threshold <= MAX_THRESHOLD,
			new InvalidRangeError(
				"threshold out of range",
				EC_INVALID_THRESHOLD,
				threshold
			)
		);
		assert(
			Array.isArray(keys),
			new InvalidTypeError(
				"not Array object",
				EC_INVALID_KEYS,
				jsonStringify({
					type: typeof keys,
					name: name(keys),
				})
			)
		);
		assert(
			keys.length > 0 && keys.length <= MAX_KEYS_IN_ADDRESS,
			new InvalidRangeError(
				"array size out of range",
				EC_INVALID_KEYS,
				keys.length
			)
		);

		keys.forEach((key, idx) => {
			assert(
				key instanceof PublicKey,
				new InvalidInstanceError(
					"not PublicKey instance",
					EC_INVALID_KEYS,
					`idx ${idx} - ${name(key)}`
				)
			);
		});

		const sum = keys.reduce((s, k) => s + k.weight.big, BigInt(0));
		assert(
			sum >= threshold,
			new InvalidRangeError(
				"threshold < sum(weights)",
				EC_INVALID_THRESHOLD,
				jsonStringify({
					threshold,
					sum: sum.toString(),
				})
			)
		);

		this.hint = new Hint(HINT_KEYS);
		this.keys = keys;
		this.threshold = new Big(threshold);
		this.hash = sum256(this.bytes());
	}

	get address() {
		return new Address(bs58.encode(this.hash) + SUFFIX_ACCOUNT_ADDRESS);
	}

	bytes() {
		return Buffer.concat([
			Buffer.concat(
				this.keys.sort(sortStringAsBuf).map((k) => k.bytes())
			),
			this.threshold.fillBytes(),
		]);
	}

	dict() {
		return {
			_hint: this.hint.toString(),
			hash: bs58.encode(this.hash),
			keys: this.keys.map((k) => k.dict()),
			threshold: this.threshold.v,
		};
	}
}
