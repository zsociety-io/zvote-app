


export function stringToBigInt(input) {
  const encoder = new TextEncoder();
  const encodedBytes = encoder.encode(input);
  encodedBytes.reverse();

  let bigIntValue = BigInt(0);
  for (let i = 0; i < encodedBytes.length; i++) {
    const byteValue = BigInt(encodedBytes[i]);
    const shiftedValue = byteValue << BigInt(8 * i);
    bigIntValue = bigIntValue | shiftedValue;
  }

  return bigIntValue;
}

export function bigIntToString(bigIntValue) {
  const bytes = [];
  let tempBigInt = bigIntValue;

  while (tempBigInt > BigInt(0)) {
    const byteValue = Number(tempBigInt & BigInt(255));
    bytes.push(byteValue);
    tempBigInt = tempBigInt >> BigInt(8);
  }

  bytes.reverse();

  const decoder = new TextDecoder();
  const asciiString = decoder.decode(Uint8Array.from(bytes));
  return asciiString;
}


export const formatNumber = (x) => (x.toFixed(2).replace(/[.,]00$/, ""));