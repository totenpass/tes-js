import { implementing, isstring } from 'tiinvo';

export interface TextDecryptionResult {
	text: string;
}

//#region typeguards

export const isTextDecryptionResult = implementing<TextDecryptionResult>({
	text: isstring,
});

//#endregion

//#region derivables

export const fromuint8array = (uint8array: Uint8Array): TextDecryptionResult => {
	const start = 2;
	const end = uint8array.length;
	const content = Array.from(uint8array).slice(start, end);
	const text = String.fromCharCode.apply(null, content);

	return { text };
}

//#endregion