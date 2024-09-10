import { dynamodb_get, dynamodb_delete, dynamodb_update } from "@/lib/externals/aws/dynamodb.js";
import { snarkvmNetworks } from "@/lib/aleo/index.js";

import { Signature, Address } from "@/lib/aleo/node-sdk.js"


import {
  random_uuid,
  timing_safe_equal,
  random_b64
} from "@/lib/utils/crypto";

import { set_cookie, get_cookie, delete_cookie } from "@/lib/utils/cookies";



export const create_handshake_token = async (
  public_key
) => {
  const handshake_token = random_uuid();

  await dynamodb_update(
    process.env.AWS_DYNAMO_DB_HANDSHAKE_TABLE,
    { address: public_key },
    { handshake_token: handshake_token }
  );

  return handshake_token;
};


export async function generate_session_token({ req, res }, signedMessage) {
  const { message, signature, publicKey } = JSON.parse(signedMessage);

  const { aud, sub, iat, jti } = JSON.parse(message);
  const snarkvmNetwork = snarkvmNetworks?.[process.env.NEXT_PUBLIC_NETWORK];
  const sig = Signature.from_string(snarkvmNetwork, signature);
  const addr = Address.from_string(snarkvmNetwork, publicKey)
  const msg = new TextEncoder().encode(message);
  if (!sig.verify(addr, msg)) {
    throw new Error("Invalid connection token signature.");
  }
  if (aud !== process.env.NEXT_PUBLIC_HOST) {
    throw new Error("Invalid signed message domain.");
  }
  if (sub !== "connect") {
    throw new Error("Invalid signed message subject.");
  }
  const tok = await dynamodb_get(
    process.env.AWS_DYNAMO_DB_HANDSHAKE_TABLE, { address: publicKey }
  );
  if (tok == null || tok.handshake_token !== jti) {
    throw new Error("Invalid handshake token.");
  };
  if (Date.now() > iat + 5 * 60 * 1000) {
    throw new Error("Expired handshake token.");
  }
  const session_token = random_b64(64);
  await Promise.all([
    dynamodb_delete(
      process.env.AWS_DYNAMO_DB_HANDSHAKE_TABLE, { address: publicKey }
    ),
    dynamodb_update(
      process.env.AWS_DYNAMO_DB_SESSIONS_TABLE,
      { address: publicKey },
      { session_token }
    ),
  ]);
  set_cookie('session_token', session_token, req, res)
  return session_token;
}


export async function isSessionTokenValid(sessionToken, address) {
  try {
    const tok = await dynamodb_get(process.env.AWS_DYNAMO_DB_SESSIONS_TABLE, { address });
    return (tok != null && timing_safe_equal(tok.session_token, sessionToken))
  } catch (e) {
    console.log(e)
  }
}


export async function get_session({ req, res }, publicKey) {
  let session_token = get_cookie('session_token', req, res)
  console.log({ session_token });

  if (!session_token || !(await isSessionTokenValid(session_token, publicKey))) {
    throw "Invalid session."
  }

  return { publicKey, session_token };
}



export async function delete_session({ req, res }, publicKey) {
  let session_token = get_cookie('session_token', req, res)

  if (!session_token || !(await isSessionTokenValid(session_token, publicKey))) {
    throw "Invalid session."
  }
  await dynamodb_delete(
    process.env.AWS_DYNAMO_DB_SESSIONS_TABLE, { address: publicKey }
  );
  delete_cookie('session_token', req, res)
  return { publicKey, session_token };
}

