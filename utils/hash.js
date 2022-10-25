import crypto from "crypto";
import jsSHA3 from "js-sha3";

export const sha256 = (msg) => {
	return crypto.createHash("sha256").update(msg).digest();
}

export const sum256 = (msg) => {
	return Buffer.from(jsSHA3.sha3_256.create().update(msg).digest());
}