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
  5u64

NODE_URL=https://api.explorer.provable.com/v1/
snarkos developer execute \
  --private-key $PRIVATE_KEY \
  --query $NODE_URL \
  --broadcast "$NODE_URL/testnet/transaction/broadcast" \
  --network 1 \
  pondo_core_protocolv1.aleo \
  claim_withdrawal_public \
  1173200000u64 



Issue 1:


- Connection on Mobile

export const useLeoWalletLocalStorageHack = () => {
  const { wallet } = useLeoWallet();

  // Temporary solution to prevent Leo Wallet from eagerly connecting on mobile devices,
  // which would result in a limbo connecting state.
  useEffect(() => {
    if (wallet) {
      localStorage.removeItem("walletName");
    }
  }, [wallet]);
};

- 'autoconnect' prop when removed it does not work anymore

- select function vs 