import { SUFFIX_LENGTH } from "../mitum.config.js";
import {
	SUFFIX_ACCOUNT_ADDRESS,
	SUFFIX_KEY_PRIVATE,
	SUFFIX_KEY_PUBLIC,
} from "../alias/key.js";

import { assert, error, EC_INVALID_KEY } from "../base/error.js";

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
	return typeof s === "string" && s === SUFFIX_ACCOUNT_ADDRESS;
};

export const isSchnorrPrivateKey = (s) => {
	if (typeof s !== "string") {
		return false;
	}

	if (s.length < 46 || s.length > 48) {
		return false;
	}

	return isPrivateKeySuffix(s.substring(s.length - SUFFIX_LENGTH));
};

export const isECDSAPrivateKey = (s) => {
	if (typeof s !== "string") {
		return false;
	}

	if (s.length !== 55) {
		return false;
	}

	if (!["L", "K"].includes(s.charAt(0))) {
		return false;
	}

	return isPrivateKeySuffix(s.substring(s.length - SUFFIX_LENGTH));
};

export const isPublicKey = (s) => {
	if (typeof s !== "string") {
		return false;
	}

	if (s.length < 46 || s.length > 48) {
		return false;
	}

	return isPublicKeySuffix(s.substring(s.length - SUFFIX_LENGTH));
};

export const isSchnorrKey = (s) => {
	if (typeof s !== "string") {
		return false;
	}

	if (s.length < 46 || s.length > 48) {
		return false;
	}

	return isKeySuffix(s.substring(s.length - SUFFIX_LENGTH));
};

export const isECDSAKey = (s) => {
	if (typeof s !== "string") {
		return false;
	}

	if (isPublicKey(s) && (s.length < 46 || s.length > 48)) {
		return false;
	}

	if (!isECDSAPrivateKey(s)) {
		return false;
	}

	return true;
};

export const isKey = (s) => {
	return isSchnorrKey(s) || isECDSAKey(s);
};

export const isAddress = (s) => {
	if (typeof s !== "string") {
		return false;
	}

	if (s.length < 46 || s.length > 47) {
		return false;
	}

	return isAddressSuffix(s.substring(s.length - SUFFIX_LENGTH));
};

export const parseKey = (s) => {
	assert(
		isKey(s),
		error.format(
			EC_INVALID_KEY,
			"invalid type, length or key suffix",
			jsonStringify({
				type: typeof s,
				length: typeof s === "string" ? s.length : null,
				suffix:
					typeof s === "string" && s.length >= SUFFIX_LENGTH
						? s.substring(s.length - SUFFIX_LENGTH)
						: null,
			})
		)
	);

	const key = s.substring(0, s.length - SUFFIX_LENGTH);
	const suffix = s.substring(s.length - SUFFIX_LENGTH);

	return {
		key,
		suffix,
	};
};
