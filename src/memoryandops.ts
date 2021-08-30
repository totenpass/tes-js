const ensurepad = (value: string, size: number) => {
  if (value.length < size) {
    const pad = '0'.repeat(Math.abs(value.length - size));
    return `${pad}${value}`;
  }

  return value;
}

export const getmemops = (mem: number, ops: number) => {
  const bitops = ensurepad(ops.toString(2), 3);
  const bitmem = ensurepad(mem.toString(2), 5);
  return Number(`0b${bitops}${bitmem}`);
}

export const getops = (uint8: number) => {
  const bytestring = uint8.toString(2);
  return Number(`0b${bytestring.substr(0, 3)}`);
}

export const getmemory = (uint8: number) => {
  const bytestring = uint8.toString(2);
  return Number(`0b${bytestring.substr(3)}`);
}
