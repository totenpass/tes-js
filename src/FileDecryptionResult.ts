import { implementing, isstring, isUint8Array } from 'tiinvo';

export interface FileDecryptionResult {
	dataurl: string;
	filecontent: Uint8Array;
	filename: string;
}

//#region typeguards

export const isFileDecryptionResult = implementing<FileDecryptionResult>({
	dataurl: isstring,
	filecontent: isUint8Array,
	filename: isstring,
});

//#endregion

//#region derivables

const fromBase64 = (base64: string) => Buffer.from(base64, 'base64').toString();

const toDataURL = (uint8array: Uint8Array) => `data:application/octet-stream;base64,${fromBase64(String.fromCharCode.apply(null, Array.from(uint8array)))}`

export const fromuint8array = (uint8array: Uint8Array): FileDecryptionResult => {
	const nullterminator = 0b0;
	const start = 2;
	const end = uint8array.length;
	const content = Array.from(uint8array).slice(start, end);

	let filename = '';
	let offset = 0;

	for (let i = 0; i < content.length; i++) {
		if (content[i] === nullterminator) {
			offset = i + 1;
			break;
		}
		filename += String.fromCharCode(content[i]);
	}

	const length = content.length - offset;
	const filecontent = new Uint8Array(length);

	for (let i = 0; i < length; i++) {
		filecontent[i] = content[i + offset];
	}

	const dataurl = toDataURL(filecontent);

	return {
		filename,
		filecontent,
		dataurl,
	}
}

//#endregion