import { TimeStamp } from "./time";

describe("test: time", () => {
	it("case: create timestamp", () => {
		const tcs = [
			{
				m: "2022-11-23 08:29:19.589808 +0000 UTC",
				b: [
					50, 48, 50, 50, 45, 49, 49, 45, 50, 51, 32, 48, 56, 58, 50,
					57, 58, 49, 57, 46, 53, 56, 57, 56, 48, 56, 32, 43, 48, 48,
					48, 48, 32, 85, 84, 67,
				],
			},
		];

		tcs.forEach((tc) => {
			const t = new TimeStamp(tc.m);
			t.bytes().forEach((b, i) => expect(b).toBe(tc.b[i]));
		});
	});
});
