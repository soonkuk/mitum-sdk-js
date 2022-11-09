# mitum-sdk

__mitum-sdk__ is Javascript SDK that helps create operations for mitum models.

* Mitum Currency

## Installation

This project has been developed in the following environments:

```sh
$ node --version
v18.9.0

$ npm --version
8.5.0
```

You can install this package locally using this command:

```sh
$ npm i
```

~~You can install __mitum-sdk__ using this command:~~ Not yet published

```sh
$ npm i mitum-sdk
```

## Test

Before testing, check `TEST_NODE` and `TEST_GENESIS` in [mitum.config.js](mitum.config.js).

You can test __mitum-sdk__ using this command:

```sh
$ npm test

> mitum-sdk@0.0.1 test
> jest

 PASS  utils/time.test.js
 PASS  key/key.test.js
 PASS  key/schnorr-keypair.test.js
 PASS  key/address.test.js
 PASS  key/ecdsa-keypair.test.js
 PASS  operations/currency/key-updater.test.js
 PASS  operations/currency/create-accounts.test.js

Test Suites: 7 passed, 7 total
Tests:       17 passed, 17 total
Snapshots:   0 total
Time:        1.721 s
Ran all test suites.
```

## Index

||Title|
|---|---|
|1|[Generate KeyPairs](#generate-keypairs)|
|-|[Random KeyPair](#random-keypair)|
|-|[From private key](#from-private-key)|
|-|[From seed](#from-seed)|
|2|[Get address from public keys](#get-address-from-public-keys)|
|3|[Generate Currency Operations](#generate-currency-operations)|
|-|[create-account](#create-account)|
|-|[key-updater](#key-updater)|
|+|[Appendix](#appendix)|

## Generate KeyPairs

__mitum-sdk__ supports two signature methods:

- General ECDSA: v1
- Schnorr DSA: v2

You can generate key pairs in the following ways:

* Generate a random KeyPair
* Generate a KeyPair from a private key
* Generate a KeyPair from a seed

* private key: [key]mpr
* public key: [key]mpu 

The following functions are prepared for key pair generation.

```js
import { KPGen } from "mitum-sdk";

// ecdsa key pair
var ekp1 = KPGen.random();
var ekp2 = KPGen.randomN(/* the number of keypairs */);
var ekp3 = KPGen.fromPrivateKey(/* string private key */);
var ekp4 = KPGen.fromSeed(/* string seed */);

// schnorr key pair
const { schnorr } = KPGen;
var skp1 = schnorr.random();
var skp2 = schnorr.randomN(/* the number of keypairs */);
var skp3 = schnorr.fromPrivateKey(/* string private key */);
var skp4 = schnorr.fromSeed(/* string seed */);
```

_If you need a key pair for schnorr signatures, use `KPGen.schnorr.(function)` instead of `KPGen.(function)`._

### Random KeyPair

#### Get a random KeyPair

```js
import { KPGen } from "mitum-sdk";

const keypair = KPGen.random(); // KeyPair instance

const priv = keypair.privateKey; // Key instance
const pub = keypair.publicKey; // Key instance

const priveStr = priv.toString(); // KwSKzHfNFKELkWs5gqbif1BqQhQjGhruKubqqU7AeKu5JPR36vKrmpr
const pubStr = pub.toString(); // 22PVZv7Cizt7T2VUkL4QuR7pmfrprMqnFDEXFkDuJdWhSmpu
```

#### Get N random KeyPairs with an address

```js
import { KPGen } from "mitum-sdk";

const n = 5

// keys: Keys[Keys] instance; with 5 MKey(pub, weight) and threshold
// keypairs: Array; 5 KeyPair(priv, pub)
const { keys, keypairs } = KPGen.randomN(5);

const address = keys.address // Address instance
```

### From private key

```js
import { KPGen } from "mitum-sdk";

const keypair = KPGen.fromPrivateKey("KwkuLfcHsxY3yGLT2wYWNgbuGD3Q1j3c7DJvaRLfmT8ujmayJUaJmpr"); // KeyPair instance

const priv = keypair.privateKey; // Key instance
const pub = keypair.publicKey; // Key instance

const priveStr = priv.toString(); // KwkuLfcHsxY3yGLT2wYWNgbuGD3Q1j3c7DJvaRLfmT8ujmayJUaJmpr
const pubStr = pub.toString(); // r3W57ffVSjnyMFQ6132ZoPj1jnbFhoSFCnDYYRq2tXQVmpu
```

### From seed

The seed string length must be at least __36__.

```js
import { KPGen } from "mitum-sdk";

const keypair = KPGen.fromSeed("Hello, world! ㅍㅅㅍ~ Hello, world! ㅍㅅㅍ~"); // KeyPair instance

const priv = keypair.privateKey; // Key instance
const pub = keypair.publicKey; // Key instance

const priveStr = priv.toString(); // L1BpsqZVzgMhkVCCvR1pyFLHNxBPYi5758uFzPdeLpjejfLxzd7Xmpr
const pubStr = pub.toString(); // j3XadE7SLSDS5B7hgTrXmAvZBGWE38WDNyLQKWxn6N96mpu
```

## Get address from public keys

Each general account in __Mitum Currency__ consists of the following elements:

* public keys
* weights: each weight is paired with a public key
* threshold
* account address

The account address is calculated based on the account's `public key`s, `weight`s, and `threshold`.

In the case of a __multi-sig__ account, the sum of the weights of all public keys that signed the operation must be greater than or equal to the threshold. Otherwise, the operation will not be processed.

Each weight and threshold range is __0 < weight, threshold <= 100__.
An account can have up to __10 public keys__.

* mitum general account address: [address]mca 

To obtain an address from public keys, you must use the following classes:

```js
import { PubKey, Keys } from "mitum-sdk";

var pub = new PubKey(/* public key; string */, /* weight; number */);
var keys = new Keys(/* pub keys; PubKey Array */, /* threshold; number */);
var address = keys.address.toString();
```

Let's do the following as an example.

* 5 public keys
* each weight: 20
* threshold: 60

Since __20 * 3 = 60__, you must sign the operation with at least __three keys__ when using this account to transfer the operation.

```js
import { PubKey, Keys } from "mitum-sdk";

const pubs = [
  	{
    	weight: 20,
		key: "23RWZ9McmTt5EpPYdLBeGYDn7nwyEB6qiPdU8DMjZ3dnkmpu",
	},
	{
		weight: 20,
		key: "vcsQ2fYSU5YVW5zRtpACXSLHtppkjCUo3tJ5witmAyZPmpu",
	},
	{
		weight: 20,
		key: "23jEC2vNwdfJn7PAKcFjy5CTVmELWdiAm6ZENEMr62cnsmpu",
	},
	{
		weight: 20,
		key: "282UNbzEAZQf3GdWJRPUrSaHWF88u297WTQbxfkytpcTsmpu",
	},
	{
	  	weight: 20,
		key: "bkPHGdsHSzRGe3NZ2hkzTSPyJx42BRaXetzy1bgBmbaAmpu",
	},
]¸
const threshold = 60;

const mpubs = pubs.map(pub => new PubKey(pub.key, pub.weight));
const mkeys = new Keys(mpubs, threshold); // Keys[Keys] instance

const address = mkeys.address // Address instance;
const stringAddress = address.toString(); // string address
```

## Generate Currency Operations

__Mitum Currency__ can handle a total of six operations.

You can use this package to create the following operations:

For general accounts:

* create-account

coming soon...

See [Appendix](#appendix) for other instructions on how to use `Operation`.

### create-account

__create-account__ is an operation to create a new general account.

The rules for account creation are as described in [2. Get address from public keys](#get-address-from-public-keys).

First, suppose you create an account with the following settings:

* 5 public keys
* each weight: 20
* threshold: 100
* initial balance: 1000 MCC, 500 PEN

```js
import { KPGen, Amount, Currency } from "mitum-sdk";

const networkId = "mitum"; // enter your network id

// create 5 new public keys
const { keys, keypairs } = KPGen.randomN(5); // use KPGen.schnorr.randomN(5) for schnorr key pairs

const mccAmount = new Amount("MCC", "1000");
const penAmount = new Amount("PEN", "500");

const item = new Currency.CreateAccountsItem(keys, [mccAmount, penAmount]);
const fact = new Currency.CreateAccountsFact(new TimeStamp().UTC(), /* sender's account address */, [item]);

const operation = new Currency.CreateAccountsOperation(networkId, fact, /* custom memo */, []);
operation.sign(key);

// see appendix
// operation.export(/* file path */);
// operation.send(/* digest api address */, /* headers */);
```

### key-updater

__key-updater__ is an operation to replace keys from an existing regular account with other keys.

See [2. Get address from public keys](#get-address-from-public-keys) for rules for the new key set.

First, suppose you add a new key to your account as follows:

* currency account keys: only 1 key (weight: 100; threshold: 100)
* account keys after updating: 2 key (one is old, one is new; each weight: 50, threshold: 100)
* currency to pay the fee: MCC

```js
import { KPGen, PubKey, Keys, Currency } from "mitum-sdk";

const networkId = "mitum"; // enter your network id

const pub1 = "22PVZv7Cizt7T2VUkL4QuR7pmfrprMqnFDEXFkDuJdWhSmpu"; // old
const pub2 = "yX3YBvu597eNgwuuJpsnZunZcDkABVeqfmiyveKuNregmpu"; // new
const keys = [new PubKey(pub1, 50), new PubKey(pub2, 50)];

const fact = new Currency.KeyUpdaterFact(new TimeStamp().UTC(), /* target account address */, new Keys(keys, 100), "MCC");

const operation = new Currency.KeyUpdaterOperation(networkId, fact, /* custom memo */, []);
operation.sign("KwSKzHfNFKELkWs5gqbif1BqQhQjGhruKubqqU7AeKu5JPR36vKrmpr"); // target account's private key; private key paired with pub1
```

## Appendix

1. Options and other methods for __Operation__.

* If you want to include the `signed_at` of the new `factsign` in the message to be signed, set it as follows before signing.

```js
const operation = new Currency.CreateAccountsOperation(/* id, fact, etc... */);
operation.forceExtendedMessage = true
operation.sign(/* sender's private key */)
```

* Send the operation directly to the network via Digest API.

```js
operation.send(/* digest api address */, /* headers */); // `headers` can be null or undefined
```

* You can export operation json to a file.

```js
operation.export(/* file path */);
```

2. Amount timestamp

__(1) Expression of timestamp__

For blocks, seals, signatures, etc., mitum uses expressions `yyyy-MM-dd HH:mm:ss.* +0000 UTC` and `yyyy-MM-ddTHH:mm:ss.*Z` as the default.

All other timezones are not allowed! Only +0000 timezone must be used for mitum.

For example,

a. When converting timestamps to byte format to generate block/seal/fact_sign hash
    - convert string `2021-11-16 01:53:30.518 +0000 UTC` to byte format

b. When are placed in block, seal, fact_sign of json files
    - convert the timestamp to `2021-11-16T01:53:30.518Z` and put it in json

To generate an operation hash, mitum concatenates byte arrays of network id, fact hash and each byte array of fact_sign.

And to generate each byte array of fact_sign, mitum concatenates byte arrays of signer, signature digest and signed_at.

Note that when converted to bytes, the format of `signed_at` is the same as `yyyy-MM-dd HH:mm:ss.* +0000 UTC`, but when put into json, it is displayed as `yyyy-MM-ddTHH:mm:ss.*Z`.

__(2) How many decimal places to be expressed?__

There is one more thing to note.

First, there is no need to pay attention to the decimal places in the 'ss.*' part of the timestamp.

Moreover, the timestamp can also be written without `.` or without decimal values below `.`.

However, when converting timestamps to byte format, you should not add unnecessary zero(0) to floating point representations in seconds(ss.*).

For example,

a. `2021-11-16T01:53:30.518Z` is converted to `2021-11-16 01:53:30.518 +0000 UTC` without any change of the time itself.

b. `2021-11-16T01:53:30.510Z` must be converted to `2021-11-16 01:53:30.51 +0000 UTC` when generating a hash.

c. `2021-11-16T01:53:30.000Z` must be converted to `2021-11-16T01:53:30 +0000 UTC` when generating a hash.

A timestamp with unnecessary zeros in the json file does not affect the processing of blocks, seals, or operations. Use caution when converting formats.

## License

[GNU GENERAL PUBLIC LICENSE Version 3](LICENSE)