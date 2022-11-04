import bs58 from "bs58";
import { schnorr } from "./schnorr-keypair";

describe("test: schnorr; keypair generation", () => {
	it("case: random", () => {
		const kp1 = schnorr.random();
		const kp2 = schnorr.fromPrivateKey(kp1.privateKey.toString());

		expect(kp2.privateKey.toString()).toBe(kp1.privateKey.toString());
		expect(kp2.publicKey.toString()).toBe(kp1.publicKey.toString());
	});

	it("case: from private key", () => {
		const testKps = [
			{
				priv: "FErPVnjF9RZBB1KN1gBeeQQqohprAfFFcDBtUSSLPLn3mpr",
				pub: "21vgR4sWkWWTTgkCCzWa8Gepy4Lp91bSF3Z4EpMuVqzMvmpu",
			},
			{
				priv: "DGB7Qb3R56MDhPiAXVHCuCSb41CgNvRCBnptQMQvbBj7mpr",
				pub: "tu93iKiEnX77sBBqY6uQYaPJTeRcXSFzQGCtwKXsywgNmpu",
			},
			{
				priv: "Co4mn2Lr6tqboxpyypHF1nmj2m3HyXnuwaK9QiPqsWn6mpr",
				pub: "oSVLVCpQYZm2RcYJKLHBodJfMWvna6WN5pHfLiLKtDkgmpu",
			},
			{
				priv: "4VHhkaKhsAppCWesSyXyrEPpmrVDLTcJYM5d39WNpzWimpr",
				pub: "gcr11NFGcCC6faaPJ4qszV58Q5KSYB5kkSRY8YKqVhttmpu",
			},
			{
				priv: "CkB4rAejq2VG3MUWqTpLAVaX4rTVvjYqws1LGZzeKaRompr",
				pub: "w65M5gGT3F51hR3nhcDtUj7RMHwjTGkFcrtqRxiu7PD2mpu",
			},
			{
				priv: "5WB9swh8nhbTa2ci6pv1Xy92eTR94D6Leo8EFjqGz6wfmpr",
				pub: "vy9tZXid5aop5HVUnWB87nRqop4Mb7TsKUAej1T1terCmpu",
			},
			{
				priv: "7qwXX1eCcXs8XURcaKFf4qNkJhM8wDziqSBvxZSA4Sx7mpr",
				pub: "x5XzoPmdyFk5z3xoEo924QdSa9qU259Cj5TY84GvbF6Umpu",
			},
			{
				priv: "HqEhjBt7nc7KC9mYmRkr1SHgbP5RovUF7SsGYDtCiCaJmpr",
				pub: "h8s8F7jKHypm1YzpVWjcwS2chkEnhfcrwyZUhqfGgyuampu",
			},
			{
				priv: "8pvkGATvZxNMpAUAQaRDLjHSqmzVjeNxtBARYXc9EJANmpr",
				pub: "owgo7zTWAjA87t9DaMogqHxuJBZLwGxnYnuNNsHA2SFnmpu",
			},
			{
				priv: "CKtUSizGoErJMM3ywCXWvnrkYh4mGRZFLcLbXZdn5Rezmpr",
				pub: "caVrKnWk1syANTEFqpfFJTgjEyqcirWmj2UzGHStsDYDmpu",
			},
		];

		testKps.forEach((tc) => {
			const tkp = schnorr.fromPrivateKey(tc.priv);

			expect(tkp.privateKey.toString()).toBe(tc.priv);
			expect(tkp.publicKey.toString()).toBe(tc.pub);
		});
	});

	it("case: from seed", () => {
		const testKps = [
			{
				seed: "mitummitummitummitummitummitummitummitum",
				priv: "7kWSghrTyZ2tAX7ETPXFNiXDeLpAn8UiqGQH9KXn6RXXmpr",
				pub: "24TbbrNYVngpPEdq6Zc5rD1PQSTGQpqwabB9nVmmonXjqmpu",
			},
			{
				priv: "5QH1MUpwrsHpaLLd4yXJgpqEQJbFjyYPBgiWEjferGRXmpr",
				pub: "28gnHT5DJtFygjCK3wbsdPfJtE45U9tXpzWyap5kXSHc3mpu",
				seed: "abcdeabcdeabcdeabcdeabcdeabcdeabcdeabcde",
			},
			{
				priv: "7cdDwK81MSYRPKnTPFTT7ssh6u8gremnjEuVkLR3ZQV4mpr",
				pub: "x1YEvgC6Je8Y9JJBnWNVP2Nfag7cULQQTA4N3247ww1Dmpu",
				seed: "aslkfjwelkfjlaskjflawkefjlwekjflwkefjlwkefj",
			},
			{
				priv: "6QXXmgv2KiNiQ7Xag8pVDajxSaqSR12ND24ep5byru41mpr",
				pub: "v99vuWLMn1rBcTi8GQna2wU61CpZh4GWzub3PGwqV7vfmpu",
				seed: "lwkejfl#@439080sdfklj1o48u3.33323li4j2l3",
			},
			{
				priv: "8y7AGQoSv2EtVoq2Gwt97scq3frjEf4baaXgMD6XAwu8mpr",
				pub: "j3XadE7SLSDS5B7hgTrXmAvZBGWE38WDNyLQKWxn6N96mpu",
				seed: "Hello, world! ㅍㅅㅍ~ Hello, world! ㅍㅅㅍ~",
			},
		];

		testKps.forEach((tc) => {
			const tkp = schnorr.fromSeed(tc.seed);

			expect(tkp.privateKey.toString()).toBe(tc.priv);
			expect(tkp.publicKey.toString()).toBe(tc.pub);
		});
	});
});

describe("test: schnorr; sign", () => {
	it("case: sign string msg", () => {
		const tcs = [
			{
				msg: "mitum",
				priv: "EBJgFK4ztAMcuYVXdBNWZqPXechG5GL84WK23HDYWeo4mpr",
				sig: "AN1rKvtNQz4Tny6bUkkPNVEgGA5Wcjn5o96z9DeX8mYEdWrvy3VoU9uVjMNspjtQsVzcEkiSfbKCRhmAydabYaTCyF7SNRyTt",
			},
			{
				msg: "this is a msg to test",
				priv: "92dKbN1VAqRL8xqFieZCDFK4W7m3MDTEcFUG3E1dfNYVmpr",
				sig: "381yXZB1gkdmH3ecUBA2VKivzqAGANmZGCQDCSskGKTnhW42uH2MCeKniX3yw7AM4HawYno8PN2ugZHwg9kX4YD2hovkRrCT",
			},
			{
				msg: "te스타 forever~",
				priv: "ACZDVWCJAa5jk6GoCrF9YFnwvfjy6CC44sVk4wkyuMymmpr",
				sig: "AN1rKvtY2WVohtRda2QMeqGGJhj4ZjtRe3E3iDeLEu2ieR6EAYq7rYgqKej6tF5G7xYq5GCxzf45iq9Jtvk8sPsfbUCmsNTXM",
			},
			{
				msg: "drill",
				priv: "HydtqvoLBC8HpumcKgDcj6wq4RRXjEY6gi1pvMXuevNGmpr",
				sig: "AN1rKvtianxQqpDCUpgTyJxtayKDqeTAcxgvoi177qB5U8rkooryHGPAtgyhKjDXz8Wk2YiCTkvdzBAKo5a1vLNUK3rgM1NdW",
			},
			{
				msg: "kim rabbit",
				priv: "Fd2n1YiMDKwujpp5KxiVHB5RShNKsQnibt9QYb67gT8Fmpr",
				sig: "381yXYonu93MQAWMPzn9mHY5zqJAUFHy7DoCqKiAsCunfJ7jmMnwXJhPvzdXQy5mFSDoMDLA2hMtWQxXq1benD7oMfisvgrB",
			},
			{
				msg: "mabeopsonyeon",
				priv: "gtuA4YJcymcjyP7DWhtkcvL7j8UmwBE4LjZPxz8WYdkmpr",
				sig: "AN1rKvti3wvvpAsjdu6VEGMqsE8fJ9B7xxc4vfN3h8mrHywFA8usvNgByuZFKEonbAxTvyizVtokX9oNsscjo87EnF3GffHNf",
			},
			{
				msg: "baehamzzi",
				priv: "35oN1fCRExBAPDKXqsbmuP9TmFKyMdDfQ6AVp1P4kpJXmpr",
				sig: "381yXYvwC2qpz5scVeED5pRP5NQZGXeY4FWty7R2gNNfFYwKvDKcshc8Cy3izje1gjETydiys6DQsDHgot6njDZNZksncNyq",
			},
			{
				msg: "dynamite",
				priv: "2YfWjLX1kJ6DMtuVuhFQK8TMzEBNnzWKRNEdJ7bZ8z8ompr",
				sig: "AN1rKvtCJw9N33a8GXhjnjgQ24cbaHuB78HvqLRDQCzGouQ8siSPCpAHnmtAAvfmJWoFKkBdV38A6qKX6tGPoRWDdiRuVjPzs",
			},
			{
				msg: "txt",
				priv: "BxpSL2SoBeH8Q2QbUHs8b1hq3sM2LuycUKDD8nbV1V1vmpr",
				sig: "381yXYxZRzmDxiGw2dfRvraPo3FqPgnWtoX16vwutoXD9gBjeUrDgRibBHWjZnXcG2uCV5EQm98XikxaBxNTzdMdWooGzi2N",
			},
		];

		tcs.forEach((tc) => {
			const kp = schnorr.fromPrivateKey(tc.priv);
			const sig = bs58.encode(kp.sign(tc.msg));

			expect(sig === tc.sig);
		});
	});
});
