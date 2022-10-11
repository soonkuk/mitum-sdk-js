# mitumjs

__mitumjs__ is Javascript SDK that helps create operations for mitum models.

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

 PASS  key/keypair.test.js
  test keypair creation
    ✓ random (78 ms)
    ✓ from private key (362 ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        0.994 s
Ran all test suites.
```

## Index

||Title|
|---|---|
|1|[Generate a KeyPair](#generate-a-keypair)|
|-|[Random KeyPair](#random-keypair)|
|-|[From private key](#from-private-key)|

## Generate a KeyPair

You can generate key pairs in the following ways:

* Generate a random KeyPair
* Generate a KeyPair from a private key

* private key: [key]mpr
* public key: [key]mpu 

### Random KeyPair

```js
import { KPGen } from "mitumjs";

const keypair = KPGen.random(); // KeyPair instance

const priv = keypair.privateKey; // Key instance
const pub = keypair.publicKey; // Key instance

const priveStr = priv.str; // 4HgoXsnnUDYxdeRmVizAtJQquRiKfVFM7C1CxmfQZgfVmpr
const pubStr = pub.str; // wjJfptqCqXhBMJmqyDca2pwUb84aZq9LtEU37kGhJensmpu
```

### From private key

```js
import { KPGen } from "mitumjs";

const keypair = KPGen.fromPrivateKey("4HgoXsnnUDYxdeRmVizAtJQquRiKfVFM7C1CxmfQZgfVmpr"); // KeyPair instance

const priv = keypair.privateKey; // Key instance
const pub = keypair.publicKey; // Key instance

const priveStr = priv.str; // 4HgoXsnnUDYxdeRmVizAtJQquRiKfVFM7C1CxmfQZgfVmpr
const pubStr = pub.str; // wjJfptqCqXhBMJmqyDca2pwUb84aZq9LtEU37kGhJensmpu
```