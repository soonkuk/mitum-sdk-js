export const name = (obj) => {
	if (obj === null) {
		return "null";
	}

	if (obj === undefined) {
		return "undefined";
	}

	try {
		return obj.constructor.name;
	} catch (e) {
		return "";
	}
};

export const sortStringAsBuf = (a, b) =>
	Buffer.compare(Buffer.from(a.toString()), Buffer.from(b.toString()));

export const sortBuf = (a, b) => Buffer.compare(a.bytes(), b.bytes());
