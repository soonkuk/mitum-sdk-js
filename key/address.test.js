import { randomN } from "./address";
import { Keys, PublicKey } from "./key";

describe("test: keys and keypairs generation", () => {
	it("case: random n", () => {
		for (let n = 1; n <= 10; n++) {
			const { keys, keypairs } = randomN(n);

			const pks = keys.keys.map(
				(k) => new PublicKey(k.toString(), k.weight.v)
			);
			const pkeys = new Keys(pks, keys.threshold.v);

			expect(pkeys.address.toString() === keys.address.toString());

			const pubKeys = keys.keys.map((k) => k.toString());
			const kpPubKeys = keypairs.map((kp) => kp.publicKey.toString());

			pubKeys.forEach((k) => expect(kpPubKeys.includes(k)));
		}
	});
});
