import {
	SUFFIX_ACCOUUNT_ADDRESS,
	SUFFIX_KEY_PRIVATE,
	SUFFIX_KEY_PUBLIC,
} from "../alias/key.js";
import { EC_INVALID_KEY, InvalidFormatError } from "../error.js";
import { jsonStringify } from "../utils/json.js";

export const isPrivateKeySuffix = (s) => {
	return typeof s === "string" && s === SUFFIX_KEY_PRIVATE;
};

export const isPublicKeySuffix = (s) => {
	return typeof s === "string" && s === SUFFIX_KEY_PUBLIC;
};

export const isKeySuffix = (s) => {
	return (
		typeof s === "string" && (isPrivateKeySuffix(s) || isPublicKeySuffix(s))
	);
};

export const isAddressSuffix = (s) => {
	return typeof s === "string" && s === SUFFIX_ACCOUUNT_ADDRESS;
};

export const isPrivateKey = (s) => {
	if (typeof s !== "string") {
		return false;
	}

	if (s.length < 46 || s.length > 48) {
		return false;
	}

	return isPrivateKeySuffix(s.substring(s.length - 3));
};

export const isPublicKey = (s) => {
	if (typeof s !== "string") {
		return false;
	}

	if (s.length < 46 || s.length > 48) {
		return false;
	}

	return isPublicKeySuffix(s.substring(s.length - 3));
};

export const isKey = (s) => {
	if (typeof s !== "string") {
		return false;
	}

	if (s.length < 46 || s.length > 48) {
		return false;
	}

	return isKeySuffix(s.substring(s.length - 3));
};

export const parseKey = (s) => {
	if (!isKey(s)) {
		throw new InvalidFormatError(
			"invalid key",
			EC_INVALID_KEY,
			jsonStringify({
				type: typeof s,
				length: typeof s === "string" ? s.length : null,
				suffix:
					typeof s === "string" && s.length >= 3
						? s.substring(s.length - 3)
						: null,
			})
		);
	}

	const key = s.substring(0, s.length - 3);
	const suffix = s.substring(s.length - 3);

	return {
		key,
		suffix,
	};
};

export const bufToBig = (buf) => {
	const big = [];

	Uint8Array.from(buf).forEach((b) => {
		b = b.toString(16);
		b.length % 2 ? big.push("0" + b) : big.push(b);
	});

	return BigInt("0x" + big.join(""));
};
