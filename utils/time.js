import { IBytes } from "../base/interface.js";
import { assert, EC_INVALID_TOKEN, InvalidFormatError } from "../base/error.js";

export class TimeStamp extends IBytes {
	constructor(s) {
		super();
		if (s === "" || s === null || s === undefined) {
			this.t = new Date();
		} else {
			try {
				this.t = new Date(s);
			} catch (e) {
				throw new InvalidFormatError(
					"invalid date",
					EC_INVALID_TOKEN,
					s
				);
			}
		}
	}

	bytes() {
		return Buffer.from(this.ISO());
	}

	toString() {
		return this.ISO();
	}

	ISO() {
		return this.t.toISOString();
	}

	UTC() {
		const iso = this.ISO();
		const t = iso.indexOf("T");
		let z = iso.indexOf("Z");
		let rtime;

		if (z < 0) {
			z = iso.indexOf("+");
		}

		assert(
			z >= 0,
			new InvalidFormatError("no 'Z in iso", EC_INVALID_TOKEN, iso)
		);

		let _time = iso.substring(t + 1, z);
		if (_time.length > 12) {
			_time = _time.substring(0, 12);
		}

		const dotIdx = _time.indexOf(".");
		if (dotIdx < 0) {
			rtime = _time;
		} else {
			const decimal = _time.substring(9, _time.length);
			const idx = decimal.lastIndexOf("0");
			if (idx < 0 || idx != decimal.length - 1) {
				rtime = _time;
			} else {
				let startIdx = decimal.length - 1;
				for (let i = decimal.length - 1; i > -1; i--) {
					if (decimal[i] == "0") {
						startIdx = i;
					} else {
						break;
					}
				}

				if (startIdx == 0) {
					rtime = _time.substring(0, dotIdx);
				} else {
					rtime =
						_time.substring(0, dotIdx) +
						"." +
						decimal.substring(0, startIdx);
				}
			}
		}

		return iso.substring(0, t) + " " + rtime + " +0000 UTC";
	}
}
