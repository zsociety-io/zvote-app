
import crypto from "crypto";


export const timing_safe_equal = (a, b) => {
  return (
    a.length === b.length
    &&
    crypto.timingSafeEqual(
      Buffer.from(a),
      Buffer.from(b)
    )
  );
}

export const random_uuid = () => {
  return crypto.randomUUID();
}


export const random_b64 = (byte_amount) => {
  return crypto.randomBytes(byte_amount).toString('base64')
}