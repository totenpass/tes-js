import * as tes from '..';
import * as fs from 'fs/promises';
import * as path from 'path';

describe(`encryption.ts`, () => {
	const passphrase = `My Secret Passphrase!`;

	test(`encodes text to base64`, async () => {
		const content = `Totenpass is a permanent digital storage drive made of solid gold.`;
		const encoded = await tes.encrypt(content, passphrase, 4, 2);
		const decoded = await tes.decrypt(encoded, passphrase);

		if (tes.TextDecryptionResult.isTextDecryptionResult(decoded)) {
			expect(decoded.text).toBe(content);
		} else {
			throw `[encode] did not encode text properly`;
		}
	});

	test(`encodes a file to base64`, async () => {
		const filename = 'Totenpass Logo.png';
		const filepath = path.join(__dirname, 'fixtures', filename);
		const content = await fs.readFile(filepath, 'utf8');
		const encoded = await tes.encrypt(content, passphrase, 4, 2, filename);
		const decoded = await tes.decrypt(encoded, passphrase);

		if (tes.FileDecryptionResult.isFileDecryptionResult(decoded)) {
			expect(decoded.filename).toBe(filename);
		} else {
			throw `[encode] did not encode file properly`;
		}
	});
});
