# Snarkos execute

# PRIVATE_KEY=
NODE_URL=https://api.explorer.provable.com/v1/
snarkos developer execute \
  --private-key $PRIVATE_KEY \
  --query $NODE_URL \
  --broadcast "$NODE_URL/testnet/transactions/broadcast" \
  --network 1 \
  wrapped_credits.aleo \
  deposit_credits_public_signer \
  5u64

