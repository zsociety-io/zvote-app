
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
