import bs58 from "bs58";

import { HINT_FACT_SIGN } from "../alias/sign.js";

import { Hint } from "../base/hint.js";
import { IBytesDict } from "../base/interface.js";
import { assert, error, EC_INVALID_PUBLIC_KEY } from "../base/error.js";

import { Key } from "../key/key.js";
import { isPublicKey } from "../key/validation.js";

import { FullTimeStamp } from "../utils/time.js";

export class FactSign extends IBytesDict {
	constructor(signer, sign, signedAt) {
		super();
		this.hint = new Hint(HINT_FACT_SIGN);
		this.sign = sign;
		this.signedAt = new FullTimeStamp(signedAt);

		assert(
			isPublicKey(signer),
			error.format(EC_INVALID_PUBLIC_KEY, "not public key")
		);
		this.signer = new Key(signer);
	}

	bytes() {
		return Buffer.concat([
			this.signer.bytes(),
			this.sign,
			this.signedAt.hashBytes(),
		]);
	}

	dict() {
		return {
			_hint: this.hint.toString(),
			signer: this.signer.toString(),
			signature: bs58.encode(this.sign),
			signed_at: this.signedAt.ISO(),
		};
	}
}
