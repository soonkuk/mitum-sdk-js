import {
	error,
	EC_NOT_IMPLEMENTED_BYTES,
	EC_NOT_IMPLEMENTED_DICT,
} from "./error.js";

export class IBytes {
	bytes() {
		throw error.nimplement(
			EC_NOT_IMPLEMENTED_BYTES,
			"unimplemented method bytes()",
			"IBytes"
		);
	}
}

export class IDict {
	dict() {
		throw error.nimplement(
			EC_NOT_IMPLEMENTED_DICT,
			"unimplemented method dict()",
			"IDict"
		);
	}
}

export class IBytesDict {
	bytes() {
		throw error.nimplement(
			EC_NOT_IMPLEMENTED_BYTES,
			"unimplemented method bytes()",
			"IBytesDict"
		);
	}

	dict() {
		throw error.nimplement(
			EC_NOT_IMPLEMENTED_DICT,
			"unimplemented method dict()",
			"IBytesDict"
		);
	}
}
