import bs58 from "bs58";

import { hint } from "../base/hint.js";
import { HINT_KEY, HINT_KEYS, SUFFIX_ACCOUUNT_ADDRESS } from "../alias/key.js";
import { IBytes, IBytesDict } from "../base/interface.js";
import {
	EC_INVALID_KEYS,
	EC_INVALID_THRESHOLD,
	EC_INVALID_WEIGHT,
	InvalidInstanceError,
	InvalidRangeError,
	InvalidTypeError,
} from "../error.js";

import { Address } from "./address.js";
import { parseKey } from "./util.js";

import Big from "../utils/big.js";
import { sum256 } from "../utils/hash.js";
import { jsonStringify } from "../utils/json.js";

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
		if (typeof weight !== "number") {
			throw new InvalidTypeError(
				"not number",
				EC_INVALID_WEIGHT,
				typeof weight
			);
		}
		if (weight < 1 || weight > 100) {
			throw new InvalidRangeError(
				"weight out of range",
				EC_INVALID_WEIGHT,
				weight
			);
		}
		this.hint = hint(HINT_KEY);
		this.weight = new Big(weight);
	}

	bytes() {
		return Buffer.concat([super.bytes(), this.weight.fillBytes()]);
	}

	dict() {
		return {
			hint: this.hint,
			weight: this.weight.v,
			key: this.toString(),
		};
	}
}

export class Keys extends IBytesDict {
	constructor(keys, threshold) {
		super();
		if (typeof threshold !== "number") {
			throw new InvalidTypeError(
				"not number",
				EC_INVALID_THRESHOLD,
				typeof threshold
			);
		}
		if (threshold < 1 || threshold > 100) {
			throw new InvalidRangeError(
				"threshold out of range",
				EC_INVALID_THRESHOLD,
				threshold
			);
		}
		if (!Array.isArray(keys)) {
			throw new InvalidInstanceError(
				"not Array instance",
				EC_INVALID_KEYS,
				jsonStringify({
					type: typeof keys,
					instance:
						typeof keys === "object" ? keys.constructor.name : null,
				})
			);
		}

		keys.forEach((key, idx) => {
			if (!key instanceof PublicKey) {
				throw new InvalidInstanceError(
					"not PublicKey instance",
					EC_INVALID_KEYS,
					`idx ${idx} - ${
						typeof key === "object"
							? key.constructor.name
							: key
							? typeof key
							: null
					}`
				);
			}
		});

		const sum = keys.reduce((s, k) => s + k.weight.big, BigInt(0));
		if (sum < threshold) {
			throw new InvalidRangeError(
				"threshold < sum(weights)",
				EC_INVALID_THRESHOLD,
				jsonStringify({
					threshold,
					sum,
				})
			);
		}

		this.hint = hint(HINT_KEYS);
		this.keys = keys;
		this.threshold = new Big(threshold);
		this.hash = sum256(this.bytes());
	}

	get address() {
		return new Address(bs58.encode(this.hash) + SUFFIX_ACCOUUNT_ADDRESS);
	}

	bytes() {
		return Buffer.concat([
			Buffer.concat(
				this.keys
					.sort((a, b) =>
						Buffer.compare(
							Buffer.from(a.toString()),
							Buffer.from(b.toString())
						)
					)
					.map((k) => k.bytes())
			),
			this.threshold.fillBytes(),
		]);
	}

	dict() {
		return {
			hint: this.hint,
			hash: bs58.encode(this.hash),
			keys: this.keys.map((k) => k.dict()),
			threshold: this.threshold.v,
		};
	}
}