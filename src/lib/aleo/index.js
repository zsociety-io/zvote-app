
import { Program, Plaintext } from "@/lib/aleo/node-sdk";



export const snarkvmNetworks = {
  testnet: "TestnetV0",
  mainnet: "MainnetV0",
  canary: "CanaryV0",
}


export const programIdToAddress = (programId) => {
  const code = `program ${programId};\nfunction hello:\nassert.eq true true;\n`
  const programAddress = Program.fromString(
    snarkvmNetworks?.[process.env.NEXT_PUBLIC_NETWORK],
    code
  ).toAddress();
  return programAddress;
}


export const ZERO_ADDRESS = `aleo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3ljyzc`;


export const hashStruct = (toHash) => {
  return Plaintext.fromString(
    snarkvmNetworks?.[process.env.NEXT_PUBLIC_NETWORK],
    toHash
  ).hashBhp256()
};


export const formatAleoString = (aleoString) => {
  const keyValueRegex = /([a-zA-Z0-9_]+)(\s*):(\s*)([a-zA-Z0-9_.]+)/g;
  const objectArrayRegex = /([a-zA-Z0-9_]+)(\s*):(\s*)(\{|\[)/g;
  const arrayElementRegex = /(\[|,)(\s*)([a-zA-Z0-9_.]+)/g;

  let replacedString = aleoString.replace(
    objectArrayRegex,
    (_, key, space1, space2, open) => {
      return `"${key}"${space1}:${space2}${open}`;
    }
  );

  replacedString = replacedString.replace(
    keyValueRegex,
    (_, key, space1, space2, value) => {
      return `"${key}"${space1}:${space2}"${value}"`;
    }
  );

  replacedString = replacedString.replace(
    arrayElementRegex,
    (_, separator, space, element) => {
      return `${separator}${space}"${element}"`;
    }
  );

  const nestedMatch = replacedString.match(objectArrayRegex);
  if (nestedMatch) {
    for (const match of nestedMatch) {
      const open = match[match.length - 1];
      const close = open === '{' ? '}' : ']';
      const nestedStart = replacedString.indexOf(match) + match.length - 1;
      let nestedEnd = nestedStart;
      let balance = 1;

      while (balance > 0) {
        nestedEnd++;
        if (replacedString[nestedEnd] === open) {
          balance++;
        } else if (replacedString[nestedEnd] === close) {
          balance--;
        }
      }

      const nestedJson = replacedString.slice(nestedStart, nestedEnd + 1);
      const formattedNestedJson = formatAleoString(nestedJson);
      replacedString = replacedString.replace(nestedJson, formattedNestedJson);
    }
  }

  return replacedString;
};
