import {
	SUFFIX_ACCOUUNT_ADDRESS,
	SUFFIX_KEY_PRIVATE,
	SUFFIX_KEY_PUBLIC,
} from "../alias/key";

import { EC_INVALID_KEY, InvalidFormatError } from "../error";

export const isKeySuffix = (s) => {
	switch (s) {
		case SUFFIX_KEY_PRIVATE:
		case SUFFIX_KEY_PUBLIC:
		case SUFFIX_ACCOUUNT_ADDRESS:
			return true;
	}

	return false;
};

export const isKey = (s) => {
	if (s.length < 47 || s.length > 48) {
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
