# Snarkos execute

# PRIVATE_KEY=
NODE_URL=https://api.explorer.provable.com/v1

snarkos developer execute \
  --private-key $PRIVATE_KEY \
  --query $NODE_URL \
  --broadcast "$NODE_URL/testnet/transaction/broadcast" \
  --network 1 \
  wrapped_credits.aleo \
  deposit_credits_public_signer \
  20_000_000u64

snarkos developer execute \
  --private-key $PRIVATE_KEY \
  --query $NODE_URL \
  --broadcast "$NODE_URL/testnet/transaction/broadcast" \
  --network 1 \
  token_registry.aleo \
  transfer_public_to_private \
  3443843282313283355522573239085696902919850365217539366784739393210722344986field \
  aleo1wamjqlka7d0gazlxdys6n8e8zeee3ymedwvw8elvh7529kwd45rq0plgax \
  10_000_000u128 \
  false



async transition transfer_public_to_private(
  3443843282313283355522573239085696902919850365217539366784739393210722344986field,
  recipient: address,
  public amount: u128,
  public external_authorization_required: bool
)


snarkos developer execute \
  --private-key $PRIVATE_KEY \
  --query $NODE_URL \
  --broadcast "$NODE_URL/testnet/transaction/broadcast" \
  --network 1 \
  pondo_core_protocolv1.aleo \
  claim_withdrawal_public \
  aleo1wamjqlka7d0gazlxdys6n8e8zeee3ymedwvw8elvh7529kwd45rq0plgax \
  1173200000u64 


