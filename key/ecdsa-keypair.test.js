import { ecdsa } from "./ecdsa-keypair";

describe("test: keypair generation", () => {
	it("case: random", () => {
		const kp1 = ecdsa.random();
		const kp2 = ecdsa.fromPrivateKey(kp1.privateKey.toString());

		expect(kp2.privateKey.toString()).toBe(kp1.privateKey.toString());
		expect(kp2.publicKey.toString()).toBe(kp1.publicKey.toString());
	});

	it("case: from private key", () => {
		const testKps = [
			{
				priv: "KwSKzHfNFKELkWs5gqbif1BqQhQjGhruKubqqU7AeKu5JPR36vKrmpr",
				pub: "22PVZv7Cizt7T2VUkL4QuR7pmfrprMqnFDEXFkDuJdWhSmpu",
			},
			{
				priv: "KwkuLfcHsxY3yGLT2wYWNgbuGD3Q1j3c7DJvaRLfmT8ujmayJUaJmpr",
				pub: "r3W57ffVSjnyMFQ6132ZoPj1jnbFhoSFCnDYYRq2tXQVmpu",
			},
			{
				priv: "KzJJKNzD1xUGnvApDUqcEkgKoXXGqq7SibC2h1HRXtASrn38kWQqmpr",
				pub: "yX3YBvu597eNgwuuJpsnZunZcDkABVeqfmiyveKuNregmpu",
			},
			{
				priv: "L4riAEL7826Lx1xSmeFfn9LsbEpNg9AeqqF6Ch7iad5WBn979MLympr",
				pub: "f8sfHFcvWZJFM4T5jGJtpxcKxdYagi3uKeGzoAqL6PQhmpu",
			},
			{
				priv: "L27bg9NwbyGpwZZ5zPEBdUJ4rZpwEtnrm1aPNWjX5TtW3CZraTsdmpr",
				pub: "dKygYYM98XycK1qA1qErYss7g6hCgLKtUbywsfCpMorjmpu",
			},
			{
				priv: "KxurztsVLp4Dsm9cJ7JQYTjLmt9LSkjgaLwewPpi9EwrHzqtAyYxmpr",
				pub: "2955ii3dQHwWGvqEjcpQqft1tMAPZ96eLNDLbHZRzTKCkmpu",
			},
			{
				priv: "L5KAuUBntFf6qTuBTmw462n2HSkZtYqKimd6AYUj75XipkJuw3xsmpr",
				pub: "zckdh2xvYg2tg2HRq6hCVwQGvMd5z7jWJ4WzcUppG3Xqmpu",
			},
			{
				priv: "KyyxfQhF3rKwGftkh6j8eeW3uSmLfoRdF1KukEELaLMpNrmjHk5Gmpr",
				pub: "uPf2riDWz8F4RteaVQn6vwKrDg141BbSfrDBDi1hTEJSmpu",
			},
			{
				priv: "L2RC9TsFWnEX74dXMiKhTwx12UbyRLy2RhcDTVzF1dn6iNjLtk6Smpr",
				pub: "rxeeTACS6AYjrgFWidmkJamQ7bCAsgjYuoN3z2QhFKW9mpu",
			},
			{
				priv: "KzR4KDNYBfb8pCGaFh5cDiGLvG757CbEgs9Fqw8NZQGKf5ENsAPgmpr",
				pub: "2AeCEK62ykU3Mgt83i6JejkEXG1PBx6McsP5AD61nGBi9mpu",
			},
		];

		testKps.forEach((tc) => {
			const tkp = ecdsa.fromPrivateKey(tc.priv);

			expect(tkp.privateKey.toString()).toBe(tc.priv);
			expect(tkp.publicKey.toString()).toBe(tc.pub);
		});
	});

	it("case: from seed", () => {
		const testKps = [
			{
				seed: "mitummitummitummitummitummitummitummitum",
				priv: "KzafpyGojcN44yme25UMGvZvKWdMuFv1SwEhsZn8iF8szUz16jskmpr",
				pub: "24TbbrNYVngpPEdq6Zc5rD1PQSTGQpqwabB9nVmmonXjqmpu",
			},
			{
				priv: "KyQq9FrK5RmjhfCTNt1ma3mKcnYnYYeuEKLv2NhAd3euoDcc88jFmpr",
				pub: "28gnHT5DJtFygjCK3wbsdPfJtE45U9tXpzWyap5kXSHc3mpu",
				seed: "abcdeabcdeabcdeabcdeabcdeabcdeabcdeabcde",
			},
			{
				priv: "KzWk9Qg4zyJKNVVWr4VHZ5Z974KbF7hTKX2AcBQ7jdDfYVfAk5Pgmpr",
				pub: "x1YEvgC6Je8Y9JJBnWNVP2Nfag7cULQQTA4N3247ww1Dmpu",
				seed: "aslkfjwelkfjlaskjflawkefjlwekjflwkefjlwkefj",
			},
			{
				priv: "KyuqYqJLC9oPtaUudToDFq1kdshADx1sAyDiRaeQHJTNGpziqZJvmpr",
				pub: "v99vuWLMn1rBcTi8GQna2wU61CpZh4GWzub3PGwqV7vfmpu",
				seed: "lwkejfl#@439080sdfklj1o48u3.33323li4j2l3",
			},
			{
				priv: "L1BpsqZVzgMhkVCCvR1pyFLHNxBPYi5758uFzPdeLpjejfLxzd7Xmpr",
				pub: "j3XadE7SLSDS5B7hgTrXmAvZBGWE38WDNyLQKWxn6N96mpu",
				seed: "Hello, world! ㅍㅅㅍ~ Hello, world! ㅍㅅㅍ~",
			},
		];

		testKps.forEach((tc) => {
			const tkp = ecdsa.fromSeed(tc.seed);

			expect(tkp.privateKey.toString()).toBe(tc.priv);
			expect(tkp.publicKey.toString()).toBe(tc.pub);
		});
	});
});
