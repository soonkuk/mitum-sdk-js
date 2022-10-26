# mitumjs

__mitumjs__ is Javascript SDK that helps create operations for mitum models.

* Mitum Currency

## Installation

This project has been developed in the following environments:

```sh
$ node --version
v18.9.0

$ npm --version
8.5.0
```

~~You can install __mitumjs__ using this command:~~ Not yet published

```sh
$ npm i mitumjs
```

## Test

You can test __mitumjs__ using this command:

```sh
$ npm test

> mitumjs@0.0.1 test
> jest

 PASS  key/key.test.js
 PASS  key/keypair.test.js
 PASS  key/address.test.js

Test Suites: 3 passed, 3 total
Tests:       6 passed, 6 total
Snapshots:   0 total
Time:        2.72 s
Ran all test suites.
```

## Index

||Title|
|---|---|
|1|[Generate a KeyPair](#generate-a-keypair)|
|-|[Random KeyPair](#random-keypair)|
|-|[From private key](#from-private-key)|
|-|[From seed](#from-seed)|
|2|[Get address from public keys](#get-address-from-public-keys)|

## Generate a KeyPair

You can generate key pairs in the following ways:

* Generate a random KeyPair
* Generate a KeyPair from a private key
* Generate a KeyPair from a seed

* private key: [key]mpr
* public key: [key]mpu 

The following functions are prepared for key pair generation.

```js
import { KPGen } from "mitumjs";

var rkp = KPGen.random();
var nkp = KPGen.randomN(/* the number of keypairs */);
var pkp = KPGen.fromPrivateKey(/* string private key */);
var skp = KPGen.fromSeed(/* string seed */);
```

### Random KeyPair

#### Get a random KeyPair

```js
import { KPGen } from "mitumjs";

const keypair = KPGen.random(); // KeyPair instance

const priv = keypair.privateKey; // Key instance
const pub = keypair.publicKey; // Key instance

const priveStr = priv.toString(); // 4HgoXsnnUDYxdeRmVizAtJQquRiKfVFM7C1CxmfQZgfVmpr
const pubStr = pub.toString(); // wjJfptqCqXhBMJmqyDca2pwUb84aZq9LtEU37kGhJensmpu
```

#### Get N random KeyPairs with an address

```js
import { KPGen } from "mitumjs";

const n = 5

// keys: MKeys[Keys] instance; with 5 MKey(pub, weight) and threshold
// keypairs: Array; 5 KeyPair(priv, pub)
const { keys, keypairs } = KPGen.randomN(5);

const address = keys.address // Address instance
```

### From private key

```js
import { KPGen } from "mitumjs";

const keypair = KPGen.fromPrivateKey("4HgoXsnnUDYxdeRmVizAtJQquRiKfVFM7C1CxmfQZgfVmpr"); // KeyPair instance

const priv = keypair.privateKey; // Key instance
const pub = keypair.publicKey; // Key instance

const priveStr = priv.toString(); // 4HgoXsnnUDYxdeRmVizAtJQquRiKfVFM7C1CxmfQZgfVmpr
const pubStr = pub.toString(); // wjJfptqCqXhBMJmqyDca2pwUb84aZq9LtEU37kGhJensmpu
```

### From seed

The seed string length must be at least __36__.

```js
import { KPGen } from "mitumjs";

const keypair = KPGen.fromSeed("Hello, world! ㅍㅅㅍ~ Hello, world! ㅍㅅㅍ~"); // KeyPair instance

const priv = keypair.privateKey; // Key instance
const pub = keypair.publicKey; // Key instance

const priveStr = priv.toString(); // 8y7AGQoSv2EtVoq2Gwt97scq3frjEf4baaXgMD6XAwu8mpr
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
import { MPubKey, MKeys } from "mitumjs";

var pub = new MPubKey(/* public key; string */, /* weight; number */);
var keys = new MKeys(/* pub keys; MPubKey Array */, /* threshold; number */);
var address = keys.address.toString();
```

Let's do the following as an example.

* 5 public keys
* each weight: 20
* threshold: 60

Since __20 * 3 = 60__, you must sign the operation with at least __three keys__ when using this account to transfer the operation.

```js
import { MPubKey, MKeys } from "mitumjs";

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

const mpubs = pubs.map(pub => new MPubKey(pub.key, pub.weight));
const mkeys = new MKeys(mpubs, threshold); // MKeys[Keys] instance

const address = mkeys.address // Address instance;
const stringAddress = address.toString(); // string address
```