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

You can install __mitumjs__ using this command:

```sh
$ npm i mitumjs
```

## Test

You can test __mitumjs__ using this command:

```sh
$ npm test
```

## Index

||Title|
|---|---|
|1|[Generate a KeyPair](#generate-a-keypair)|
|-|[Random KeyPair](#random-keypair)|
|-|[From Private Key](#from-private-key)|

## Generate a KeyPair

You can generate key pairs in the following ways:

* Generate a random KeyPair
* Generate a KeyPair from a private key

* private key: [key]mpr
* public key: [key]mpu 

### Random KeyPair

```js
import { kp } from "mitumjs";

const keypair = kp.random(); // KeyPair instance

const priv = keypair.privateKey; // Key instance
const pub = keypair.publicKey; // Key instance

const priveStr = priv.str; // 4HgoXsnnUDYxdeRmVizAtJQquRiKfVFM7C1CxmfQZgfVmpr
const pubStr = pub.str; // wjJfptqCqXhBMJmqyDca2pwUb84aZq9LtEU37kGhJensmpu
```

### From Private Key

```js
import { kp } from "mitumjs";

const keypair = kp.fromPrivateKey("4HgoXsnnUDYxdeRmVizAtJQquRiKfVFM7C1CxmfQZgfVmpr"); // KeyPair instance

const priv = keypair.privateKey; // Key instance
const pub = keypair.publicKey; // Key instance

const priveStr = priv.str; // 4HgoXsnnUDYxdeRmVizAtJQquRiKfVFM7C1CxmfQZgfVmpr
const pubStr = pub.str; // wjJfptqCqXhBMJmqyDca2pwUb84aZq9LtEU37kGhJensmpu
```