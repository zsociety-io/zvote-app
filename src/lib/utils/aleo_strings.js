const MAX_BYTES_PER_FIELD = 31;

function encode(str, numFieldElements = 4) {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  let totalBytes = bytes.length;
  if (totalBytes > 123) {
    throw new Error("Input string is too long to encode");
  }
  const maxTotalBytes = MAX_BYTES_PER_FIELD * numFieldElements;
  const newBytes = new Uint8Array(maxTotalBytes);
  newBytes[0] = totalBytes;
  newBytes.set(bytes, 1);
  let fieldElements = [];
  for (let i = 0; i < numFieldElements; i++) {
    const chunk = newBytes.slice(i * MAX_BYTES_PER_FIELD, (i + 1) * MAX_BYTES_PER_FIELD);
    let value = BigInt(0);
    for (let j = 0; j < chunk.length; j++) {
      value += BigInt(chunk[j]) << BigInt(8 * j);
    }
    fieldElements.push(value);
  }
  return fieldElements;
}

function decode(fieldElements) {
  const maxTotalBytes = MAX_BYTES_PER_FIELD * fieldElements.length; // 124
  const bytes = new Uint8Array(maxTotalBytes);
  for (let i = 0; i < fieldElements.length; i++) {
    let value = fieldElements[i];
    for (let j = 0; j < MAX_BYTES_PER_FIELD; j++) {
      bytes[i * MAX_BYTES_PER_FIELD + j] = Number((value >> BigInt(8 * j)) & BigInt(0xFF));
    }
  }
  const totalBytes = bytes[0];
  if (totalBytes > 123) {
    throw new Error("Invalid totalBytes value");
  }
  const dataBytes = bytes.slice(1, 1 + totalBytes);
  const decoder = new TextDecoder();
  return decoder.decode(dataBytes).replace(/\x00+$/, '');
}


const inputString = "Hello, World! fez fze fz ef zef ezf";
const fieldElements = encode(inputString);
console.log("Encoded field elements:", fieldElements);

const decodedString = decode(fieldElements);
console.log("Decoded string:", decodedString);

/*
const nameHashField = 4039165989542226292217059306495671259264448213602066982803038338315267964460n;
const uri = encodeURIComponent(
  decode([
    nameHashField,
    0n,
    0n,
    0n
  ])
);
const baseUrl = "https://testnet-api.aleonames.id/token/";
const metadataUri = `${baseUrl}${uri}`

*/


const nameHash = [4039165989542226292217059306495671259264448213602066982803038338315267964460n, 0n, 0n, 0n];
console.log(
  encode(decode(nameHash))
)

console.log(encode("OELA"))




console.log(decode([1095517519n]))


stringToBigInt("azdfgbfdezazerfgfezerfgfdezaerfgfdezefggfdsq")



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

function stringToFields(input, numFieldElements = 4) {
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

function fieldsToString(fields) {
  let bigIntValue = BigInt(0);
  let multiplier = BigInt(1);
  for (const fieldElement of fields) {
    bigIntValue += fieldElement * multiplier;
    multiplier *= FIELD_MODULUS;
  }
  return bigIntToString(bigIntValue);
}

console.log(stringToFields("ANS"));

