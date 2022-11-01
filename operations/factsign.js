import { SUFFIX_LENGTH } from "../mitum.config.js";

import bs58 from "bs58";

import { HINT_FACT_SIGN } from "../alias/sign.js";
import {
	assert,
	EC_INVALID_PUBLIC_KEY,
	InvalidFormatError,
} from "../base/error.js";
import { Hint } from "../base/hint.js";
import { IBytesDict } from "../base/interface.js";

import { Key } from "../key/key.js";
import { isPublicKey } from "../key/util.js";
import { TimeStamp } from "../utils/time.js";

export class FactSign extends IBytesDict {
	constructor(signer, sign, signedAt) {
		this.hint = new Hint(HINT_FACT_SIGN);
		this.sign = sign;
		this.signedAt = new TimeStamp(signedAt);

		assert(
			isPublicKey(signer),
			new InvalidFormatError(
				"not public key",
				EC_INVALID_PUBLIC_KEY,
				jsonStringify({
					length: signer.length,
					suffix:
						signer.length >= SUFFIX_LENGTH
							? signer.substring(signer.length - SUFFIX_LENGTH)
							: null,
				})
			)
		);
		this.signer = new Key(signer);
	}

	bytes() {
		return Buffer.concat([
			this.signer.bytes(),
			this.sign,
			Buffer.from(this.signedAt.UTC()),
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
