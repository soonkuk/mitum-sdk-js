import {
	error,
	EC_NOT_IMPLEMENTED_BYTES,
	EC_NOT_IMPLEMENTED_DICT,
} from "./error.js";

export class IBytes {
	bytes() {
		throw error.nimplement(
			"unimplemented method bytes()",
			EC_NOT_IMPLEMENTED_BYTES,
			"IBytes"
		);
	}
}

export class IDict {
	dict() {
		throw error.nimplement(
			"unimplemented method dict()",
			EC_NOT_IMPLEMENTED_DICT,
			"IDict"
		);
	}
}

export class IBytesDict {
	bytes() {
		throw error.nimplement(
			"unimplemented method bytes()",
			EC_NOT_IMPLEMENTED_BYTES,
			"IBytesDict"
		);
	}

	dict() {
		throw error.nimplement(
			"unimplemented method dict()",
			EC_NOT_IMPLEMENTED_DICT,
			"IBytesDict"
		);
	}
}
