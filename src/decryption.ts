import sodium from 'libsodium-wrappers';
import { filetype_text, memlimit_bytes } from '.';
import * as TFileDecryptionResult from './FileDecryptionResult';
import { getmemory, getops } from './memoryandops';
import * as TTextDecryptionResult from './TextDecryptionResult';

export type DecryptionResult = TFileDecryptionResult.FileDecryptionResult | TTextDecryptionResult.TextDecryptionResult;

const versionposition = 0;
const versionlength = 1;
const memposition = versionlength + versionposition;
const memlength = 1;
const saltposition = memlength + memposition;
const saltlength = 16;

const contentoffset = saltposition + saltlength;

export const base64touint8 = async (base64: string) => {
	await sodium.ready;
	return sodium.from_base64(base64);
}

export const isvaliddecodablefile = (uint8array: Uint8Array) => {
	const isfirstbyte0 = uint8array[versionposition] === 0b0;
	const bytelength = uint8array.byteLength;

	return bytelength >= 33 && isfirstbyte0;
}

const grepsalt = (uint8array: Uint8Array) => {
	const saltbytes = new Uint8Array(saltlength);
	for (let index = saltposition; index <= uint8array.length; index++) {
		saltbytes[index - saltposition] = uint8array[index];
	}
	return saltbytes;
}

const grepencryptedbytes = (uint8array: Uint8Array) => {
	const offset = contentoffset;
	const encryptedbytes = new Uint8Array(uint8array.length - offset);
	for (let index = offset; index < uint8array.length; index++) {
		encryptedbytes[index - offset] = uint8array[index];
	}
	return encryptedbytes;
}

const isplaintextfile = (uint8array: Uint8Array) => {
	return uint8array[1] === filetype_text;
}

const grepmemlimit = (uint8array: Uint8Array) => {
	return getmemory(uint8array[memposition]);
}

const grepopslimit = (uint8array: Uint8Array) => {
	return getops(uint8array[memposition]);
}

export const decrypt = async (base64file: string, password: string): Promise<DecryptionResult> => {
	const uint8file = await base64touint8(base64file);

	if (!isvaliddecodablefile(uint8file)) {
		return Promise.reject(new Error('Base64 string is not a valid encrypted file'));
	}

	const salt = grepsalt(uint8file);
	const memlimit = grepmemlimit(uint8file);
	const opslimit = grepopslimit(uint8file);
	const key = Buffer.from(
		sodium.crypto_pwhash(
			sodium.crypto_aead_xchacha20poly1305_IETF_KEYBYTES,
			password,
			salt,
			opslimit,
			memlimit_bytes(memlimit),
			sodium.crypto_pwhash_ALG_ARGON2ID13
		)
	);
	const bytes = grepencryptedbytes(uint8file);
	const nonce = bytes.slice(0, sodium.crypto_aead_xchacha20poly1305_IETF_NPUBBYTES);
	const cyphertext = bytes.slice(sodium.crypto_aead_xchacha20poly1305_IETF_NPUBBYTES, bytes.length);
	const res = sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(null, cyphertext, null, nonce, key);
	const fn = isplaintextfile(res) ? TTextDecryptionResult.fromuint8array : TFileDecryptionResult.fromuint8array;

	return fn(res);
}