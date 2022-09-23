import { random, fromPrivateKey } from "./keypair.js";

describe("test keypair creation", () => {
	it("random", () => {
		const kp1 = random();

		const kp2 = fromPrivateKey(kp1.privateKey.str);

		expect(kp2.privateKey.str).toBe(kp1.privateKey.str);
		expect(kp2.publicKey.str).toBe(kp1.publicKey.str);
	});

	it("from private key", () => {
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
			const tkp = fromPrivateKey(tc.priv);

			expect(tkp.privateKey.str).toBe(tc.priv);
			expect(tkp.publicKey.str).toBe(tc.pub);
		});
	});
});
