const FIELD_MODULUS = 8444461749428370424248824938781546531375899335154063827935233455917409239040n;

function stringToBigInt(input) {
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

function bigIntToString(bigIntValue) {
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

function stringToBigIntFieldArray(input, numFieldElements = 4) {
  const bigIntValue = stringToBigInt(input);
  const fieldElements = [];
  let remainingValue = bigIntValue;
  for (let i = 0; i < numFieldElements; i++) {
    const fieldElement = remainingValue % FIELD_MODULUS;
    fieldElements.push(fieldElement);
    remainingValue = remainingValue / FIELD_MODULUS;
  }
  if (remainingValue !== 0n) {
    throw new Error("String is too big to be encoded.");
  }
  return fieldElements;
}


function stringToBigIntFieldList(input) {
  const bigIntValue = stringToBigInt(input);
  const fieldElements = [];
  let remainingValue = bigIntValue;
  while (true) {
    const fieldElement = remainingValue % FIELD_MODULUS;
    fieldElements.push(fieldElement);
    remainingValue = remainingValue / FIELD_MODULUS;
    if (remainingValue === 0n) {
      break;
    }
  }
  return fieldElements;
}

export function stringToFieldList(input) {
  const content = stringToBigIntFieldList(input)
    .map(
      (fieldBigInt) => `${fieldBigInt}field`
    )
    .join(', ');

  return `[${content}]`;
}

function fieldsToString(fields) {
  let bigIntValue = BigInt(0);
  let multiplier = BigInt(1);
  for (const fieldElement of fields) {
    bigIntValue += fieldElement * multiplier;
    multiplier *= FIELD_MODULUS;
  }
  return bigIntToString(bigIntValue);
}
