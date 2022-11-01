import fs from "fs";

import { EC_FILE_CREATION_FAILED, RuntimeError } from "../base/error.js";

export const jsonStringify = (json) => {
	return JSON.stringify(json, null, 4);
};

export const exportJson = (fp, json) => {
	if (typeof json !== "string") {
		try {
			json = jsonStringify(json);
		} catch (e) {
			return;
		}
	}

	fs.writeFile(fp, json, (error) => {
		throw new RuntimeError(
			"write-file failed",
			EC_FILE_CREATION_FAILED,
			fp
		);
	});
};
