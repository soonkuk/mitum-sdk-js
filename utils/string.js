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
