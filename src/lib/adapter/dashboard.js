import {
  Transaction,
  WalletAdapterNetwork,
} from '@demox-labs/aleo-wallet-adapter-base';
import { random_from_type, } from "@/lib/aleo/front.js";



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


export const createApproveProposerProposal = async (
  publicKey,
  requestTransaction,
  dao_id,
  proposer,
  voting_system,
  vs_params_hash,
  isAdd
) => {
  const programId = process.env.NEXT_PUBLIC_PSM_DAO_BASED_PROGRAM_ID;
  const functionName = 'create_approve_proposal';
  const fee = 1_000_000;

  const proposal_id = random_from_type("field");

  const parsedInputs = [
    dao_id,
    proposal_id,
    proposer,
    voting_system,
    vs_params_hash,
    String(isAdd)
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
  daoManager,
  dao_id,
  voting_system,
  vs_params_hash,
  isAdd
) => {
  const programId = daoManager;
  const functionName = isAdd ? 'add_voting_system' : 'remove_voting_system';
  const fee = 1_000_000;

  const parsedInputs = [
    dao_id,
    voting_system,
    vs_params_hash
  ];
  console.log({ parsedInputs })

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


export const createVotingSystemProposal = async (
  publicKey,
  requestBulkTransactions,
  votingSystemManager,
  dao_id,
  proposed_voting_system,
  proposed_vs_params_hash,
  voting_system,
  vs_params_hash,
  is_add
) => {
  const programId = votingSystemManager;
  const functionName = 'create_approve_proposal';
  const fee = 1_000_000;

  console.log({ votingSystemManager })
  const proposal_id = random_from_type("field");

  const parsedInputs = [
    dao_id,
    proposal_id,
    proposed_voting_system,
    proposed_vs_params_hash,
    voting_system,
    vs_params_hash,
    String(is_add)
  ];
  console.log({ parsedInputs })

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



export const updateDaoManager = async (
  dao,
  publicKey,
  requestTransaction,
  daoId,
  newDaoManager,
  daoManagerUpdater,
  votingSystemManager,
  proposersManager,
) => {
  const formerDaoManager = dao?.dao_manager?.program_id;
  const programId = process.env.NEXT_PUBLIC_H_UPDATE_DAOM_PROGRAM_ID;

  const from = (
    formerDaoManager === process.env.NEXT_PUBLIC_DAOM_APL_PROGRAM_ID
  ) ? "ap" : "na";
  const to = (
    newDaoManager === process.env.NEXT_PUBLIC_DAOM_APL_PROGRAM_ID
  ) ? "ap" : "na";
  const functionName = `update_${from}_to_${to}`;
  const fee = 1_000_000;
  const parsedInputs = [
    daoId,
    daoManagerUpdater,
    votingSystemManager
  ];
  if (proposersManager != null) {
    parsedInputs.push(proposersManager)
  }

  console.log({
    publicKey,
    net: WalletAdapterNetwork.TestnetBeta,
    programId,
    functionName,
    parsedInputs,
    fee,
  })
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


// addApprovedProposer
// daom__approved_proposers_003.aleo/add_approved_proposer