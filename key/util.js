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

export const isAddress = (s) => {
	if (typeof s !== "string") {
		return false;
	}

	if (s.length < 46 || s.length > 47) {
		return false;
	}

	return isAddressSuffix(s.substring(s.length - 3));
};

export const parseKey = (s) => {
	if (!isKey(s)) {
		throw new InvalidFormatError(
			"invalid type, length or key suffix",
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
