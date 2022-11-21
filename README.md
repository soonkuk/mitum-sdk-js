# mitum-sdk

__mitum-sdk__ is Javascript SDK that helps create operations for mitum models.

* Mitum Currency
* Mitum Currency Extension

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

Before testing, check `TEST_ID`, `TEST_NODE`, `TEST_GENESIS`, and `TEST_ACCOUNT` in [mitum.config.js](mitum.config.js).

You can test __mitum-sdk__ using this command:

```sh
$ npm test

> mitum-sdk@0.0.1 test
> jest

 PASS  operations/currency/create-accounts.test.js
 PASS  operations/currency/suffrage-inflation.test.js
 PASS  operations/currency/create-contract-accounts.test.js
 PASS  operations/currency/transfers.test.js
 PASS  operations/currency/key-updater.test.js
 PASS  utils/config.test.js
 PASS  utils/time.test.js
 PASS  operations/currency/currency-policy-updater.test.js
 PASS  operations/currency/currency-register.test.js
 PASS  key/schnorr-keypair.test.js
 PASS  key/key.test.js
 PASS  key/address.test.js
 PASS  operations/currency/withdraws.test.js
 PASS  key/ecdsa-keypair.test.js

Test Suites: 14 passed, 14 total
Tests:       39 passed, 39 total
Snapshots:   0 total
Time:        1.302 s, estimated 2 s
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
|-|[transfer](#transfer)|
|-|[currency-register](#currency-register)|
|-|[currency-policy-updater](#currency-policy-updater)|
|-|[suffrage-inflation](#suffrage-inflation)|
|-|[create-contract-account](#create-contract-account)|
|-|[withdraw](#withdraw)|
|+|[Appendix](#appendix)|

To set the mitum version of all hints and the network id, refer to [Set version of hints](#set-version-of-hints) and .

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
* address

The address is calculated based on the account's `public key`s, `weight`s, and `threshold`.

In the case of a __multi-sig__ account, the sum of the weights of all public keys that signed the operation must be greater than or equal to the threshold. Otherwise, the operation will not be processed.

Each weight and threshold range is __0 < weight, threshold <= 100__.
An account can have up to __10 public keys__.

* mitum general address: [address]mca 

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
import { TimeStamp, KPGen, Amount, Currency, Operation } from "mitum-sdk";

// create 5 new public keys
const { keys, keypairs } = KPGen.randomN(5); // use KPGen.schnorr.randomN(5) for schnorr key pairs

const mccAmount = new Amount("MCC", "1000");
const penAmount = new Amount("PEN", "500");

const token = new TimeStamp().UTC(); // any unique string
const senderAddress = "DBa8N5of7LZkx8ngH4mVbQmQ2NHDd6gL2mScGfhAEqddmca";
const senderPrivate = "KzFERQKNQbPA8cdsX5tCiCZvR4KgBou41cgtPk69XueFbaEjrczbmpr";

const item = new Currency.CreateAccountsItem(keys, [mccAmount, penAmount]);
const fact = new Currency.CreateAccountsFact(token, senderAddress, [item]);

const memo = ""; // any string
const operation = new Operation(fact, memo, []);
operation.sign(senderPrivate);

// see appendix
// operation.export(/* file path; string */);
// operation.request(/* digest api address; string */, /* headers; obj */);
```

`KPGen.randomN(n)` and `KPGen.schnorr.randomN(n)` always return `Keys` with a threshold __100__.

To generate `Keys` with thresholds and weights, use `PubKey` and `Keys` as follows:

```js
import { /* KPGen, */ PubKey, Keys, Currency } from "mitum-sdk";

// const randomPub = KPGen.random().publicKey.toString();

const pub1 = "your public key1";
const pub2 = "your public key2";
...

const key1 = new PubKey(pub1, /* weight; number */);
const key2 = new PubKey(pub2, /* weight; number */);
...

const keys = new Keys([key1, key2, ...], /* threshold; number */)

const item = new Currency.CreateAccountsItem(keys, /* amounts; Amount Array */);
```

### key-updater

__key-updater__ is an operation to replace keys from an existing regular account with other keys.

See [2. Get address from public keys](#get-address-from-public-keys) for rules for the new key set.

First, suppose you add a new key to your account as follows:

* currency account keys: only 1 key (weight: 100; threshold: 100)
* account keys after updating: 2 key (one is old, one is new; each weight: 50, threshold: 100)
* currency to pay the fee: MCC

```js
import { TimeStamp, PubKey, Keys, Currency, Operation } from "mitum-sdk";

const pub1 = "22PVZv7Cizt7T2VUkL4QuR7pmfrprMqnFDEXFkDuJdWhSmpu"; // new pub1
const pub2 = "yX3YBvu597eNgwuuJpsnZunZcDkABVeqfmiyveKuNregmpu"; // new pub2
const keys = [new PubKey(pub1, 50), new PubKey(pub2, 50)];

const token = new TimeStamp().UTC(); // any unique string
const targetAddress = "DBa8N5of7LZkx8ngH4mVbQmQ2NHDd6gL2mScGfhAEqddmca";
const targetPrivate = "KzFERQKNQbPA8cdsX5tCiCZvR4KgBou41cgtPk69XueFbaEjrczbmpr";

const fact = new Currency.KeyUpdaterFact(token, targetAddress, new Keys(keys, 100), "MCC");

const memo = ""; // any string
const operation = new Operation(fact, memo, []);
operation.sign(targetPrivate);
```

### transfer

__transfer__ is an operation to transfer tokens to another account.

For each type of token(aka. currency id), a fee based on the token policy is withdrawn together.

Suppose you transfer tokens to a general account as follows:

* receiver: 8iRVFAPiHKaeznfN3CmNjtFtjYSPMPKLuL6qkaJz8RLumca
* tokens to transfer: 1000 MCC, 100 PEN

```js
import { TimeStamp, Amount, Currency, Operation } from "mitum-sdk";

const receiver = "8iRVFAPiHKaeznfN3CmNjtFtjYSPMPKLuL6qkaJz8RLumca";
const mccAmount = new Amount("MCC", "1000");
const penAmount = new Amount("PEN", "100");

const token = new TimeStamp().UTC(); // any unique string
const senderAddress = "DBa8N5of7LZkx8ngH4mVbQmQ2NHDd6gL2mScGfhAEqddmca";
const senderPrivate = "KzFERQKNQbPA8cdsX5tCiCZvR4KgBou41cgtPk69XueFbaEjrczbmpr";

const item = new Currency.TransfersItem(receiver, [mccAmount, penAmount]);
const fact = new Currency.TransfersFact(token, senderAddress, [item]);

const memo = ""; // any string
const operation = new Operation(fact, memo, []);
operation.sign(senderPrivate);
```

### currency-register

__current-register__ is the operation to register the currency id and policy of the new token.

When registering a new token, you can choose one of the fee policies:

* nil (no fee)
* fixed (fixed fee)
* ratio (proportional fee)

__(1) Feeer__

First, you need to create a `feeer` that contains the contents of each fee policy.

```js
import { Currency } from "mitum-sdk";

const feeReceiver = "DBa8N5of7LZkx8ngH4mVbQmQ2NHDd6gL2mScGfhAEqddmca"; // receiver address to receive fees;

/* nil */
const nilFeeer = new Currency.NilFeeer();

/* fixed */
const fixedFeeer = new Currency.FixedFeeer(feeReceiver, "10");

/* ration */
const feeRatio = 0.5; // 0 <= fee ratio <= 1; float
const minFee = "1"; // minimum fee
const maxFee = "10000"; // maximum fee
const ratioFeeer = new Currency.RatioFeeer(feeReceiver, feeRatio , minFee, maxFee);
```

__(2) Operation__

Then, create an operation.

```js
import { TimeStamp, Amount, Currency, Operation } from "mitum-sdk";

// creating feeer
// ...
// done!

const currency = "MCC"; // currency id to register
const minBalance = "33"; // new account min balance(amount)
const initialSupply = "999999999999999999999999999999999999";
const genesis = "DBa8N5of7LZkx8ngH4mVbQmQ2NHDd6gL2mScGfhAEqddmca"; // genesis account address

const policy = new Currency.CurrencyPolicy(minBalance, feeer); // feeer: NilFeeer || FixedFeeer || RatioFeeer 
const amount = new Amount(currency, initialSupply);
const design = new Currency.CurrencyDesign(amount, genesis, policy);

const token = new TimeStamp().UTC(); // any unique string
const fact = new Currency.CurrencyRegisterFact(token, design);

const memo = ""; // any string
const operation = new Operation(fact, memo, []);
operation.sign("KxaTHDAQnmFeWWik5MqWXBYkhvp5EpWbsZzXeHDdTDb5NE1dVw8wmpr"); // node private
```

### currency-policy-updater

__currency-policy-updater__ is an operation that allows you to update policies of already registered tokens.

Here, the way to create a feeer is the same as [currency-register](#currency-register).

```js
import { TimeStamp, Currency, Operation } from "mitum-sdk";

const currency = "MCC"; // currency id to update `policy`

// creating feeer
// ...
// done!

const minBalance = "33"; // new account min balance(amount)
const policy = new Currency.CurrencyPolicy(minBalance, feeer); // feeer: NilFeeer || FixedFeeer || RatioFeeer 

const token = new TimeStamp().UTC(); // any unique string
const fact = new Currency.CurrencyPolicyUpdaterFact(token, currency, policy);

const memo = ""; // any string
const operation = new Operation(fact, memo, []);
operation.sign("KxaTHDAQnmFeWWik5MqWXBYkhvp5EpWbsZzXeHDdTDb5NE1dVw8wmpr"); // node private
```

### suffrage-inflation

__suffrage-inflation__ is an operation to supply additional tokens to the network.

You can specify accounts to deposit additional supplies to that account.

Assume that you supply tokens as follows:

* supply MCC: receiver1, 10000000 tokens
* supply PEN: receiver2, 500000 tokens
* supply TXT: receiver3, 999998888 tokens
* supply BTS: receiver4, 292929292 tokens
* supply TST: receiver5, 999991888 tokens

```js
import { TimeStamp, Amount, Currency, Operation } from "mitum-sdk";

const receiver1 = "receiver1's account address";
...
const receiver5 = "receiver5's account address";

const mcc = new Amount("MCC", "10000000");
const pen = new Amount("PEN", "500000");
const txt = new Amount("TXT", "999998888");
const bts = new Amount("BTS", "292929292");
const tst = new Amount("TST", "999991888");

const imcc = new Currency.SuffrageInflationItem(receiver1, mcc);
const ipen = new Currency.SuffrageInflationItem(receiver2, pen);
const itxt = new Currency.SuffrageInflationItem(receiver3, txt);
const ibts = new Currency.SuffrageInflationItem(receiver4, bts);
const itst = new Currency.SuffrageInflationItem(receiver5, tst);


const token = new TimeStamp().UTC(); // any unique string
const fact = new Currency.SuffrageInflationFact(token, [imcc, ipen, itxt, ibts, itst]);

const memo = ""; // any string
const operation = new Operation(fact, memo, []);
operation.sign("KxaTHDAQnmFeWWik5MqWXBYkhvp5EpWbsZzXeHDdTDb5NE1dVw8wmpr"); // node private
```

### create-contract-account

__create-contract-account__ is an operation to create a new contract account provided by __Mitum Currency Extension__.

The rules for contract account creation are as described in [2. Get address from public keys](#get-address-from-public-keys). (exactly the same as general account)

First, suppose you create a contract account with the following settings:

* 5 public keys
* each weight: 20
* threshold: 100
* initial balance: 1000 MCC, 500 PEN

Here, the weight and threshold are only used to generate the account address and do not affect the behavior of the account at all after the account is registered.

```js
import { TimeStamp, KPGen, Amount, Currency, Operation } from "mitum-sdk";

// create 5 new public keys
const { keys, keypairs } = KPGen.randomN(5); // use KPGen.schnorr.randomN(5) for schnorr key pairs

const mccAmount = new Amount("MCC", "1000");
const penAmount = new Amount("PEN", "500");

const token = new TimeStamp().UTC(); // any unique string
const senderAddress = "DBa8N5of7LZkx8ngH4mVbQmQ2NHDd6gL2mScGfhAEqddmca";
const senderPrivate = "KzFERQKNQbPA8cdsX5tCiCZvR4KgBou41cgtPk69XueFbaEjrczbmpr";

const item = new Currency.CreateContractAccountsItem(keys, [mccAmount, penAmount]);
const fact = new Currency.CreateContractAccountsFact(token, senderAddress, [item]);

const memo = ""; // any string
const operation = new Operation(fact, memo, []);
operation.sign(senderPrivate);
```

### withdraw

__withdraw__ is an operation for withdrawing tokens from a contract account.

Overall, it is similar to __transfer__.

Suppose your contract account is __DBa8N5of7LZkx8ngH4mVbQmQ2NHDd6gL2mScGfhAEqdmca__ and you want to withdraw the token from this account as follows:

* contract account: DBa8N5of7LZkx8ngH4mVbQmQ2NHDd6gL2mScGfhAEqddmca
* tokens to transfer: 1000 MCC, 100 PEN

```js
import { TimeStamp, Amount, Currency, Operation } from "mitum-sdk";

const contractAccount = "8iRVFAPiHKaeznfN3CmNjtFtjYSPMPKLuL6qkaJz8RLumca";
const mccAmount = new Amount("MCC", "1000");
const penAmount = new Amount("PEN", "100");

const token = new TimeStamp().UTC(); // any unique string
const senderAddress = "DBa8N5of7LZkx8ngH4mVbQmQ2NHDd6gL2mScGfhAEqddmca";
const senderPrivate = "KzFERQKNQbPA8cdsX5tCiCZvR4KgBou41cgtPk69XueFbaEjrczbmpr";

const item = new Currency.WithdrawsItem(contractAccount, [mccAmount, penAmount]);
const fact = new Currency.WithdrawsFact(token, senderAddress, [item]);

const memo = "";
const operation = new Operation(fact, memo, []);
operation.sign(senderPrivate);
```

## Appendix

### Set version of hints

To change the mitum version of every objects, add the following code to the part where the app is initialized.

The default version is `v0.0.1`.

```js
import { useV } from "mitum-sdk";

useV("v0.0.2");
```

### Set network id of operations

To apply your network id to operations, add the following code to the part where the app is initialized.

The default id is `mitum`.

```js
import { usedId } from "mitum-sdk";

useId("mainnet");
```

### Options and other methods for __Operation__

* If you want to include the `signed_at` of the new `factsign` in the message to be signed, set it as follows before signing.

```js
const operation = new Operation(/* fact, etc... */);
operation.forceExtendedMessage = true
operation.sign(/* sender's private key */)
```

* Send the operation directly to the network via Digest API.

```js
operation.request(/* digest api address */, /* headers */); // `headers` can be null or undefined
```

* You can export operation json to a file.

```js
operation.export(/* file path */);
```

### About timestamp

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