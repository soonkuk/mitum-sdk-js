import {
	SUFFIX_ACCOUUNT_ADDRESS,
	SUFFIX_KEY_PRIVATE,
	SUFFIX_KEY_PUBLIC,
} from "../alias/key.js";
import { EC_INVALID_KEY, InvalidFormatError } from "../error.js";

export const isKeySuffix = (s) => {
	return s === SUFFIX_KEY_PRIVATE || s === SUFFIX_KEY_PUBLIC;
};

export const isAddressSuffix = (s) => {
	return s === SUFFIX_ACCOUUNT_ADDRESS;
};

export const isKey = (s) => {
	if (s.length < 46 || s.length > 48) {
		return false;
	}
	return isKeySuffix(s.substring(s.length - 3));
};

export const parseKey = (s) => {
	if (!isKey(s)) {
		throw new InvalidFormatError("invalid key", EC_INVALID_KEY, s);
	}

	const key = s.substring(0, s.length - 3);
	const suffix = s.substring(s.length - 3);

	return {
		key,
		suffix,
	};
};
