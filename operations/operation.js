import bs58 from "bs58";

import {
	assert,
	EC_FACTSIGN_CREATION_FAILED,
	EC_INVALID_FACT,
	EC_INVALID_FACTSIGN,
	EC_INVALID_MEMO,
	InvalidInstanceError,
	InvalidTypeError,
	RuntimeError,
} from "../base/error.js";
import { ID } from "../base/ID.js";
import { Hint } from "../base/hint.js";
import { IBytesDict } from "../base/interface.js";

import { Fact } from "./fact.js";
import { FactSign } from "./factsign.js";

import { exportJson, jsonStringify } from "../utils/json.js";
import { name } from "../utils/string.js";
import { sum256 } from "../utils/hash.js";
import { schnorr } from "../key/schnorr-keypair.js";

export class Operation extends IBytesDict {
	constructor(id, hint, fact, memo, factSigns) {
		this.hint = new Hint(hint);
		this.id = new ID(id);

		assert(
			fact instanceof Fact,
			new InvalidInstanceError(
				"not Fact instance",
				EC_INVALID_FACT,
				name(fact)
			)
		);
		this.fact = fact;

		assert(
			typeof memo === "string",
			new InvalidTypeError("not string", EC_INVALID_MEMO, typeof memo)
		);
		this.memo = memo;

		assert(
			Array.isArray(factSigns),
			new InvalidTypeError(
				"not Array",
				EC_INVALID_FACTSIGN,
				jsonStringify({
					type: typeof factSigns,
					name: name(factSigns),
				})
			)
		);
		factSigns.forEach((fs) => {
			assert(
				fs instanceof FactSign,
				new InvalidInstanceError(
					"not FactSign instance",
					EC_INVALID_FACTSIGN,
					name(fs)
				)
			);
		});
		this.factSigns = factSigns;

		this.hash = this.hashing();
	}

	hashing() {
		return sum256(this.bytes());
	}

	sign(priv) {
		const kp = schnorr.fromPrivateKey(priv);
		const msg = Buffer.concat([this.fact.hash, this.id.bytes()]);
		try {
			this.factSigns.push(
				new FactSign(kp.publicKey.toString(), kp.sign(msg), "")
			);
		} catch (e) {
			throw new RuntimeError(
				"add-factsign failed",
				EC_FACTSIGN_CREATION_FAILED,
				jsonStringify({
					id: this.id.toString(),
					fact: bs58.encode(this.fact.hash),
					signer: kp.publicKey.toString(),
				})
			);
		}
		this.hash = this.hashing();
	}

	bytes() {
		return Buffer.concat([
			this.fact.hash,
			Buffer.concat(this.factSigns.map((fs) => fs.bytes())),
			Buffer.from(this.memo),
		]);
	}

	dict() {
		return {
			memo: this.memo,
			_hint: this.hint.toString(),
			fact: this.fact.dict(),
			hash: bs58.encode(this.hash),
			fact_signs: this.factSigns.map((fs) => fs.dict()),
		};
	}

	export(fp) {
		exportJson(fp, this.dict());
	}
}
