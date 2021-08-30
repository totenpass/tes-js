import sodium from 'libsodium-wrappers';
import { check, implementing, isstring, optional } from 'tiinvo';
import { filetype_text } from '.';
import { filetype_binary, memlimit_bytes, version } from './consts';
import { getmemops } from './memoryandops';

export interface EncryptArgument {
	content: string;
	filename?: string;
	passphrase: string;
}

const isEncryptArgument = implementing<EncryptArgument>({
  content: isstring,
  filename: optional(isstring),
  passphrase: isstring,
});

const concatUint8Array = (... arrays: Uint8Array[]) => {
  const maxsize = arrays.reduce((s, c) => s + c.length, 0);
  const uint8Array = new Uint8Array(maxsize);

  let cursor = 0;

  for (let i = 0; i < arrays.length; i++) {
    for (let a = 0; a < arrays[i].length; a++) {
      uint8Array[cursor] = arrays[i][a];
      cursor += 1;
    }
  }

  return uint8Array;
};


const processbinarycontent = async (file: EncryptArgument) => {
  const filecontent = file.content as string;
  const filename = file.filename as string;
  const plaintext = new ArrayBuffer(filecontent.length + filename.length + 3);
  const uint8Array = new Uint8Array(plaintext);
  
  let skip = 2;

  uint8Array[0] = version; // version
  uint8Array[1] = filetype_binary; // text/file

  for (let i = 0; i < filename.length; i++) {
    uint8Array[i + skip] = filename.charCodeAt(i);

    if (i === filename.length - 1) {
      uint8Array[i + skip + 1] = 0b0;    
    }
  }

  skip += filename.length + 1;

  for (let i = 0; i < filecontent.length; i++) {
    uint8Array[i + skip] = filecontent.charCodeAt(i);
  }

  return uint8Array;
}

const processtextcontent = async (file: EncryptArgument) => {
  const filecontent = file.content as string;
  const plaintext = new ArrayBuffer(filecontent.length + 2);
  const uint8Array = new Uint8Array(plaintext);
  let skip = 2;

  uint8Array[0] = version; // version
  uint8Array[1] = filetype_text; // text/file

  for (let i = 0; i < filecontent.length; i++) {
    uint8Array[i + skip] = filecontent.charCodeAt(i);
  }

  return uint8Array;
};

export const encrypt = async (content: string, passphrase: string, opslimit: number, memlimit: number, filename?: string) => {
  await sodium.ready;
  
  const arg = { content, passphrase, filename };
  const memopsbyte = getmemops(memlimit, opslimit);
  const encryptargument = check(isEncryptArgument(arg), 'arg does not implements EncryptArgument type')(arg);
  const fn = isstring(encryptargument.filename) ? processbinarycontent : processtextcontent;
  const u8arraycontent = await fn(encryptargument);
  const salt = Buffer.from(sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES));
  const key = Buffer.from(
	  sodium.crypto_pwhash(
		  sodium.crypto_aead_xchacha20poly1305_IETF_KEYBYTES, 
		  encryptargument.passphrase, 
		  salt, 
		  opslimit, 
		  memlimit_bytes(memlimit), 
		  sodium.crypto_pwhash_ALG_ARGON2ID13
		)
	);

  const nonce = sodium.randombytes_buf(sodium.crypto_aead_xchacha20poly1305_IETF_NPUBBYTES);
  const ciphertext = concatUint8Array(nonce, sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(u8arraycontent, null, null, nonce, key));

  return sodium.to_base64(
    concatUint8Array(
      new Uint8Array([0, memopsbyte]),
      salt,
      ciphertext,
    ),
  );
}
