import { get_request } from 'lib/utils/network.js';
import { randBetween } from 'bigint-crypto-utils'

const programAddresses = {};


export const programIdToAddress = async (programId) => {
  const cached = programAddresses?.[programId];
  if (cached != null) {
    return cached;
  }
  programAddresses[programId] = (await get_request(
    `/api/contract/address/${programId}`
  )).address;
  console.log({ addr: programAddresses[programId] })
  return programAddresses[programId];
}


export const loadProgramAddresses = async (programIds) => {
  await Promise.all(
    programIds.map(
      async (programId) => (await programIdToAddress(programId))
    )
  );
  return programAddresses;
}


export const hashStruct = async (struct) => {
  return (await get_request(
    `/api/contract/hash/${encodeURIComponent(struct)}`
  )).hash;
}



export const constant_type_ranges = {
  scalar: {
    min: BigInt("0"), // included
    max: BigInt("2111115437357092606062206234695386632838870926408408195193685246394721360382"),  // included
  },
  field: {
    min: BigInt("0"), // included
    max: BigInt("8444461749428370424248824938781546531375899335154063827935233455917409239040"), // included
  },
}


export const format_type = (int_val, type_str) => {
  return `${int_val}${type_str}`;
}


export const type_ranges = (type) => {
  const constant_type_range = constant_type_ranges[type];
  if (constant_type_range) {
    return constant_type_range;
  }
  if (type.startsWith("u")) {
    const bits = type.slice(1);
    return {
      min: BigInt("0"),
      max: BigInt("2") ** BigInt(bits) - BigInt("1"),
    }
  }
  if (type.startsWith("i")) {
    const bits = parseInt(type.slice(1));
    return {
      min: BigInt("-2") ** BigInt(String(bits - 1)),
      max: BigInt("2") ** BigInt(String(bits - 1)) - BigInt("1"),
    }
  }
  return null;
}


export const random_from_type = (type) => {
  const range = type_ranges(type);
  if (!range) {
    throw new Error(`Cannot take random value of type '${type}'.`);
  }
  const randval = randBetween(range.max, range.min);
  return format_type(randval, type);
}








export const ZERO_ADDRESS = `aleo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3ljyzc`;
