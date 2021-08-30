tes-js
======

JavaScript implementation of the Total Encryption Standard Specification

# Installation

```bash
npm i @totenpass/tes
```

or if you use yarn

```bash
yarn add @totenpass/tes
```

# How to use tes-js

Tes-js implements the decrypt of the [Total Encryption Standard](https://github.com/totenpass/tes-specs)


## encrypting some text

```ts
import * as tes from '@totenpass/tes';

const passphrase = `My Secret Passphrase!`;
const text = `lorem ipsum dolor sit amet`;

// text to encrypt, passphrase, ops limit, mem limit
tes.encrypt(text, passphrase, 4, 2).then(console.log)
```

## encrypting a file text

```ts
import * as tes from '@totenpass/tes';
import * as fs from 'node:fs';
import * as path from 'node:path';

const passphrase = `My Secret Passphrase!`;
const filename = 'Totenpass Logo.png';
const filepath = path.join(__dirname, 'fixtures', filename);
const filecontent = fs.readFileSync(filepath, 'utf8');

// text to encrypt, passphrase, ops limit, mem limit, filename
tes.encrypt(filecontent, passphrase, 4, 2 filename).then(console.log)
```

## decrypting some text

```ts
import * as tes from '@totenpass/tes';

const base64file = `AIIo5iih-FcSXacIUdKRoOXVXvgWocImR26ReogzrdJjufnNzTD9V3ea9XSCpX_v-1VrM6M_nRZBv8GqLrFS3IIEHWJ6Una0MfKh6ibfxgVYmYHOBe-lVEUX_CGt6UhbQyoYBdgiDEIggsGcZTl7hyvp3viPoZrzFbaeZElD`
const passphrase = `My Secret Passphrase!`;

// decrypt
tes.decrypt(base64file, passphrase).then(console.log);
```

# Contributing

Every contribution is welcome!

If you feel that something can be improved or should be fixed, feel free to open an issue with the feature or the bug found.

If you want to fork and open a pull request (adding features or fixes), feel free to do it. Create a new branch from the main branch and open your PR.
