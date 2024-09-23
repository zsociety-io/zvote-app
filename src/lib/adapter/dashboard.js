import {
  Transaction,
  WalletAdapterNetwork,
} from '@demox-labs/aleo-wallet-adapter-base';



export const addApprovedProposer = async (
  publicKey,
  requestTransaction,
  dao_id,
  proposer,
  isAdd
) => {
  const programId = process.env.NEXT_PUBLIC_DAOM_APL_PROGRAM_ID;
  const functionName = isAdd ? 'add_approved_proposer' : 'remove_approved_proposer';
  const fee = 1_000_000;

  const parsedInputs = [
    dao_id,
    proposer
  ];

  const createTransaction = Transaction.createTransaction(
    publicKey,
    WalletAdapterNetwork.TestnetBeta,
    programId,
    functionName,
    parsedInputs,
    fee,
    false
  );

  await requestTransaction(
    createTransaction,
  );
}


export const addVotingSystem = async (
  publicKey,
  requestBulkTransactions,
  votingSystemManager,
  dao_id,
  voting_system,
  vs_params_hash,
  isAdd
) => {
  const programId = votingSystemManager;
  const functionName = isAdd ? 'add_voting_system' : 'remove_voting_system';
  const fee = 1_000_000;

  const parsedInputs = [
    dao_id,
    voting_system,
    vs_params_hash
  ];

  const createTransaction = Transaction.createTransaction(
    publicKey,
    WalletAdapterNetwork.TestnetBeta,
    programId,
    functionName,
    parsedInputs,
    fee,
    false
  );

  await requestBulkTransactions([
    createTransaction,
  ]);

}


// addApprovedProposer
// daom__approved_proposers_003.aleo/add_approved_proposer