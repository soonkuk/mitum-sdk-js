import fs from "fs";
import bs58 from "bs58";
import axios from "axios";

import { Fact } from "./fact.js";
import { FactSign } from "./factsign.js";

import {
	assert,
	error,
	EC_FACTSIGN_CREATION_FAILED,
	EC_INVALID_FACT,
	EC_INVALID_FACTSIGN,
	EC_INVALID_MEMO,
	EC_INVALID_PRIVATE_KEY,
	EC_FILE_CREATION_FAILED,
} from "../base/error.js";
import { ID } from "../base/ID.js";
import { Hint } from "../base/hint.js";
import { IBytesDict } from "../base/interface.js";

import { id, isExtendedMessageForced } from "../utils/config.js";
import { sortBuf } from "../utils/string.js";
import { sum256 } from "../utils/hash.js";
import { TimeStamp } from "../utils/time.js";

import { ecdsa } from "../key/ecdsa-keypair.js";
import { schnorr } from "../key/schnorr-keypair.js";
import { isECDSAPrivateKey, isSchnorrPrivateKey } from "../key/validation.js";

export class Operation extends IBytesDict {
	constructor(fact, memo, factSigns) {
		super();
		this.id = new ID(id());

		assert(
			fact instanceof Fact,
			error.instance(EC_INVALID_FACT, "not Fact instance")
		);
		this.hint = new Hint(fact.opHint);
		this.fact = fact;

		assert(
			typeof memo === "string",
			error.type(EC_INVALID_MEMO, "not string")
		);
		this.memo = memo;

		this.factSigns = [];
		if (factSigns) {
			assert(
				Array.isArray(factSigns),
				error.type(EC_INVALID_FACTSIGN, "not Array")
			);
			factSigns.forEach((fs) => {
				assert(
					fs instanceof FactSign,
					error.instance(EC_INVALID_FACTSIGN, "not FactSign instance")
				);
			});
			this.factSigns = factSigns;
		}

		this.hash = this.hashing();
		this.forceExtendedMessage = isExtendedMessageForced();
	}

	hashing() {
		return sum256(this.bytes());
	}

	_kp(privateKey) {
		assert(
			typeof privateKey === "string",
			error.type(EC_INVALID_PRIVATE_KEY, "not string")
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
			error.format(EC_INVALID_PRIVATE_KEY, "wrong private key")
		);

		return { type: keyType, keypair: kp };
	}

	sign(privateKey) {
		const now = new TimeStamp();
		const kp = this._kp(privateKey);
		if (kp.type === "schonorr") {
			this.forceExtendedMessage = true;
		}

		let msg = undefined;
		if (this.forceExtendedMessage) {
			msg = Buffer.concat([this.id.bytes(), this.fact.hash, now.bytes()]);
		} else {
			msg = Buffer.concat([this.fact.hash, this.id.bytes()]);
		}

		let factSign = null;
		try {
			factSign = new FactSign(
				kp.keypair.publicKey.toString(),
				kp.keypair.sign(msg),
				now.toString()
			);
		} catch (e) {
			throw error.runtime(
				EC_FACTSIGN_CREATION_FAILED,
				"create-factsign failed"
			);
		}

		assert(
			factSign !== null,
			error.runtime(EC_FACTSIGN_CREATION_FAILED, "null factsign")
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
		const op = {
			_hint: this.hint.toString(),
			memo: this.memo,
			fact: this.fact.dict(),
			hash: bs58.encode(this.hash),
		};

		const signs = this.factSigns.sort(sortBuf).map((fs) => fs.dict());

		if (this.forceExtendedMessage) {
			op.signs = signs.map((fs) => {
				delete fs["_hint"];
				return fs;
			});
		} else {
			op.fact_signs = signs;
		}

		return op;
	}

	export(fp) {
		fs.writeFile(fp, JSON.stringify(this.dict(), null, 4), (_) => {
			throw error.runtime(EC_FILE_CREATION_FAILED, "write-file failed");
		});
	}

	request(url, headers) {
		if (headers) {
			return axios.post(url, this.dict(), { headers });
		}
		return axios.post(url, this.dict());
	}
}
