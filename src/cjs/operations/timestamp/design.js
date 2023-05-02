const HINT_TIMESTAMP_DESIGN = "mitum-timestamp-design";
const HINT_TIMESTAMP_ITEM = "mitum-timestamp-item";

const { ContractID } = require("../../base/ID.js");
const {
	assert,
	error,
} = require("../../base/error.js");
const { Hint } = require("../../base/hint.js");
const { IBytesDict } = require("../../base/interface.js");

const { sortStringAsBuf } = require("../../utils/string.js");

class Design extends IBytesDict {
	constructor(service, projects) {
		super();
		this.hint = new Hint(HINT_TIMESTAMP_DESIGN);
		this.service = new ContractID(service);
		const parr = projects.map((project) => {
			assert(
				project.length < 1,
				error.format("invalid string format", "string length zero")
			);

			return project;
		});
		const pset = new Set(parr);
		assert(
			parr.length === pset.size,
			error.duplicate("invalid projects", "duplicate project in projects")
		);

		this.projects = projects;
	}

	bytes() {
		return Buffer.concat([
			this.service.bytes(),
			Buffer.concat(
				this.projects.sort(sortStringAsBuf).map((p) => Buffer.from(p))
			),
		]);
	}

	dict() {
		return {
			_hint: this.hint.toString(),
			service: this.service.toString(),
			projects: this.projects.sort(sortStringAsBuf).map((p) => p),
		};
	}
}

module.exports = {
	Design,
};