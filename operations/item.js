import { Hint } from "../base/hint.js";
import { IBytesDict } from "../base/interface.js";

export class Item extends IBytesDict {
	constructor(hint) {
		super();
		this.hint = new Hint(hint);
	}
}
