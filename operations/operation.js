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
	EC_INVALID_SIG_TYPE,
} from "../base/error.js";
import { ID } from "../base/ID.js";
import { Hint } from "../base/hint.js";
import { IBytesDict } from "../base/interface.js";

import { id, sigType, SIG_TYPE } from "../utils/config.js";
import { sortBuf } from "../utils/string.js";
import { sum256 } from "../utils/hash.js";
import { TimeStamp } from "../utils/time.js";

import { Address } from "../key/address.js";
import { m1 } from "../key/m1-keypair.js";
import { m2 } from "../key/m2-keypair.js";
import { isM1PrivateKey, isM2PrivateKey } from "../key/validation.js";

export class Operation extends IBytesDict {
	constructor(fact, memo) {
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
		this.hash = null;

		this.sigType = sigType();
	}

	setFactSigns(factSigns) {
		if (factSigns) {
			assert(
				Array.isArray(factSigns),
				error.type(EC_INVALID_FACTSIGN, "not Array")
			);
			const farr = factSigns.map((fs) => {
				assert(
					fs instanceof FactSign,
					error.instance(EC_INVALID_FACTSIGN, "not FactSign instance")
				);
				return fs.signer.toString();
			});
			const fset = new Set(farr);
			assert(
				farr.length === fset.size,
				error.duplicate(EC_INVALID_FACTSIGN, "duplicate fact signs")
			);

			this.factSigns = factSigns;
		}

		this.hash = this.hashing();
	}

	hashing() {
		switch (this.sigType) {
			case SIG_TYPE.DEFAULT:
				return sum256(this.bytes());
			case SIG_TYPE.M2:
			case SIG_TYPE.M2_NODE:
				return sum256(this.m2Bytes());
			default:
				throw error.runtime(EC_INVALID_SIG_TYPE, "invalid sig-type");
		}
	}

	sign(privateKey, option) {
		const now = new TimeStamp();
		const kp = findKp(privateKey);

		let node = null;
		if (this.sigType === SIG_TYPE.M2_NODE) {
			assert(
				option && Object.prototype.hasOwnProperty.call(option, "node"),
				error.runtime(
					EC_INVALID_FACTSIGN,
					"no node address in sig option"
				)
			);
			node = new Address(option.node);
		}

		let msg = undefined;
		switch (this.sigType) {
			case SIG_TYPE.DEFAULT:
				msg = Buffer.concat([this.fact.hash, this.id.bytes()]);
				break;
			case SIG_TYPE.M2:
				msg = Buffer.concat([
					this.id.bytes(),
					this.fact.hash,
					now.bytes(),
				]);
				break;
			case SIG_TYPE.M2_NODE:
				msg = Buffer.concat([
					this.id.bytes(),
					node.bytes(),
					this.fact.hash,
					now.bytes(),
				]);
				break;
			default:
				throw error.runtime(EC_INVALID_SIG_TYPE, "invalid sig-type");
		}

		let factSign = null;
		try {
			factSign = new FactSign(
				node ? node.toString() : null,
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

	m2Bytes() {
		return Buffer.concat([
			this.fact.hash,
			Buffer.concat(this.factSigns.sort(sortBuf).map((fs) => fs.bytes())),
		]);
	}

	dict() {
		const op = {
			_hint: this.hint.toString(),
			memo: this.memo,
			fact: this.fact.dict(),
			hash: this.hash ? bs58.encode(this.hash) : "",
		};

		const signs = this.factSigns
			? this.factSigns.sort(sortBuf).map((fs) => fs.dict())
			: [];

		switch (this.sigType) {
			case SIG_TYPE.DEFAULT:
				op.fact_signs = signs;
				break;
			case SIG_TYPE.M2:
			case SIG_TYPE.M2_NODE:
				op.signs = signs
					? signs.map((fs) => {
							delete fs["_hint"];
							return fs;
					  })
					: [];
				break;
			default:
				throw error.runtime(EC_INVALID_SIG_TYPE, "invalid sig-type");
		}

		return op;
	}

	export(fp) {
		fs.writeFile(fp, JSON.stringify(this.dict(), null, 4), (e) => {
			if (e) {
				throw error.runtime(
					EC_FILE_CREATION_FAILED,
					"write-file failed; operation"
				);
			}
		});
	}

	request(url, headers) {
		if (headers) {
			return axios.post(url, this.dict(), { headers });
		}
		return axios.post(url, this.dict());
	}
}

const findKp = (privateKey) => {
	assert(
		typeof privateKey === "string",
		error.type(EC_INVALID_PRIVATE_KEY, "not string")
	);

	const keyType = isM2PrivateKey(privateKey)
		? "m2"
		: isM1PrivateKey(privateKey)
		? "m1"
		: null;

	const kp =
		keyType === "m2"
			? m2.fromPrivateKey(privateKey)
			: keyType === "m1"
			? m1.fromPrivateKey(privateKey)
			: null;

	assert(
		kp !== null && keyType !== null,
		error.format(EC_INVALID_PRIVATE_KEY, "wrong private key")
	);

	return { type: keyType, keypair: kp };
};
