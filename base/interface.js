import {
	EC_NOT_IMPLEMENTED_BYTES,
	EC_NOT_IMPLEMENTED_DICT,
	NotImplementedError,
} from "../error";

export class IBytes {
	bytes() {
		throw new NotImplementedError(
			"unimplemented method bytes()",
			EC_NOT_IMPLEMENTED_BYTES,
			"IBytes"
		);
	}
}

export class IDict {
	dict() {
		throw new NotImplementedError(
			"unimplemented method dict()",
			EC_NOT_IMPLEMENTED_DICT,
			"IDict"
		);
	}
}

export class IBytesDict {
	bytes() {
		throw new NotImplementedError(
			"unimplemented method bytes()",
			EC_NOT_IMPLEMENTED_BYTES,
			"IBytesDict"
		);
	}

	dict() {
		throw new NotImplementedError(
			"unimplemented method dict()",
			EC_NOT_IMPLEMENTED_DICT,
			"IBytesDict"
		);
	}
}
