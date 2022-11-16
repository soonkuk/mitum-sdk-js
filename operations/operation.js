import bs58 from "bs58";
import axios from "axios";

import { Fact } from "./fact.js";
import { FactSign } from "./factsign.js";

import { SUFFIX_LENGTH } from "../mitum.config.js";

import {
	assert,
	EC_FACTSIGN_CREATION_FAILED,
	EC_INVALID_FACT,
	EC_INVALID_FACTSIGN,
	EC_INVALID_MEMO,
	EC_INVALID_PRIVATE_KEY,
	InvalidFormatError,
	InvalidInstanceError,
	InvalidTypeError,
	RuntimeError,
} from "../base/error.js";
import { ID } from "../base/ID.js";
import { Hint } from "../base/hint.js";
import { IBytesDict } from "../base/interface.js";

import { name, sortBuf } from "../utils/string.js";
import { sum256 } from "../utils/hash.js";
import { TimeStamp } from "../utils/time.js";
import { exportJson, jsonStringify } from "../utils/json.js";

import { ecdsa } from "../key/ecdsa-keypair.js";
import { schnorr } from "../key/schnorr-keypair.js";
import { isECDSAPrivateKey, isSchnorrPrivateKey } from "../key/validation.js";

export class Operation extends IBytesDict {
	constructor(id, hint, fact, memo, factSigns) {
		super();
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

		this.factSigns = [];
		if (factSigns) {
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
		}

		this.hash = this.hashing();
		this.forceExtendedMessage = false;
	}

	hashing() {
		return sum256(this.bytes());
	}

	_kp(privateKey) {
		assert(
			typeof privateKey === "string",
			new InvalidTypeError(
				"not string",
				EC_INVALID_PRIVATE_KEY,
				typeof privateKey
			)
		);

		const keyType = isSchnorrPrivateKey(privateKey)
			? "schnorr"
			: isECDSAPrivateKey(privateKey)
			? "ecdsa"
			: null;

		const kp =
			keyType === "schnorr"
				? schnorr.fromPrivateKey(privateKey)
				: keyType === "ecdsa"
				? ecdsa.fromPrivateKey(privateKey)
				: null;

		assert(
			kp !== null && keyType !== null,
			new InvalidFormatError(
				"wrong private key",
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

		return { type: keyType, keypair: kp };
	}

	get _msg() {
		return Buffer.concat([this.fact.hash, this.id.bytes()]);
	}

	sign(privateKey) {
		const now = new TimeStamp();
		const kp = this._kp(privateKey);

		const signInfo = jsonStringify({
			id: this.id.toString(),
			fact: bs58.encode(this.fact.hash),
			signer: kp.keypair.publicKey.toString(),
		});

		let msg = undefined;
		if (this.forceExtendedMessage || kp.type === "schnorr") {
			msg = Buffer.concat([this._msg, now.toString()]);
		} else {
			msg = this._msg;
		}

		let factSign = null;
		try {
			factSign = new FactSign(
				kp.keypair.publicKey.toString(),
				kp.keypair.sign(msg),
				now.toString()
			);
		} catch (e) {
			throw new RuntimeError(
				"create-factsign failed",
				EC_FACTSIGN_CREATION_FAILED,
				signInfo
			);
		}

		assert(
			factSign !== null,
			new RuntimeError(
				"null factsign",
				EC_FACTSIGN_CREATION_FAILED,
				signInfo
			)
		);

		const idx = this.factSigns
			.map((fs) => fs.signer.toString())
			.indexOf(kp.keypair.publicKey.toString());

		if (idx < 0) {
			this.factSigns.push(factSign);
		} else {
			this.factSigns[idx] = factSign;
		}
		this.hash = this.hashing();
	}

	bytes() {
		return Buffer.concat([
			this.fact.hash,
			Buffer.concat(this.factSigns.sort(sortBuf).map((fs) => fs.bytes())),
			Buffer.from(this.memo),
		]);
	}

	dict() {
		return {
			memo: this.memo,
			_hint: this.hint.toString(),
			fact: this.fact.dict(),
			hash: bs58.encode(this.hash),
			fact_signs: this.factSigns.sort(sortBuf).map((fs) => fs.dict()),
		};
	}

	export(fp) {
		exportJson(fp, this.dict());
	}

	request(url, headers) {
		if (headers) {
			return axios.post(url, this.dict(), { headers });
		}
		return axios.post(url, this.dict());
	}
}
