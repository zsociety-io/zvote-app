import {
  Transaction,
  WalletAdapterNetwork,
} from '@demox-labs/aleo-wallet-adapter-base';
import { hashStruct, random_from_type, } from "@/lib/aleo/front.js";

import { getDao, } from "@/lib/zvote/front";

import { getMappingValue, addressToProgramId, getStatus } from "@/lib/aleo/aleoscan";


export const getProposalParamsTx = async (
  publicKey,
  votingSystem,
  proposalBlocks
) => {
  const currentHeight = (await getStatus()).latest_block_height;
  const end_block = Number(proposalBlocks) + Number(currentHeight);
  const proposalParams = `{end_block: ${end_block}u32}`;
  const proposalParamsHash = await hashStruct(proposalParams);

  const programId = votingSystem;
  const functionName = 'reference_proposal_params';
  const fee = 1_000_000;

  const parsedInputs = [
    proposalParams
  ];

  const proposalParamsTx = Transaction.createTransaction(
    publicKey,
    WalletAdapterNetwork.TestnetBeta,
    programId,
    functionName,
    parsedInputs,
    fee,
    false
  );

  return [proposalParamsHash, proposalParamsTx]

}



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
  requestBulkTransactions,
  dao_id,
  proposer,
  voting_system,
  vs_params_hash,
  isAdd,
  proposalBlocks
) => {
  const programId = process.env.NEXT_PUBLIC_PSM_DAO_BASED_PROGRAM_ID;
  const functionName = 'create_approve_proposal';
  const fee = 1_000_000;

  const proposal_id = random_from_type("field");

  const [proposalParamsHash, proposalParamsTx] = await getProposalParamsTx(
    publicKey,
    voting_system.program_id,
    proposalBlocks
  );

  const parsedInputs = [
    dao_id,
    proposal_id,
    proposalParamsHash,
    proposer,
    voting_system.address,
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

  const transactions = [
    createTransaction,
  ];
  if (proposalParamsTx) {
    transactions.push(proposalParamsTx)
  }

  await requestBulkTransactions(transactions);
}



export const addVotingSystem = async (
  publicKey,
  requestBulkTransactions,
  daoManager,
  dao_id,
  voting_system,
  vs_params_hash,
  isAdd,
  inputVSParams
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

  const transactions = [createTransaction];

  if (isAdd) {
    const feeReferenceParamsTransaction = 1_000_000;

    const voting_system_program_id = await addressToProgramId(voting_system);
    const referenceParamsTransaction = Transaction.createTransaction(
      publicKey,
      WalletAdapterNetwork.TestnetBeta,
      voting_system_program_id,
      "reference_voting_system_params",
      [inputVSParams],
      feeReferenceParamsTransaction,
      false
    );
    const notReferencedYet = (
      null == await getMappingValue(
        voting_system_program_id,
        "voting_system_params",
        vs_params_hash
      )
    );
    if (notReferencedYet) {
      transactions.push(referenceParamsTransaction);
    }
  }

  await requestBulkTransactions(transactions);
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
  is_add,
  inputVSParams,
  proposalBlocks
) => {
  const programId = votingSystemManager;
  const functionName = 'create_approve_proposal';
  const fee = 1_000_000;

  const proposal_id = random_from_type("field");

  const [proposalParamsHash, proposalParamsTx] = await getProposalParamsTx(
    publicKey,
    voting_system.program_id,
    proposalBlocks
  );

  const parsedInputs = [
    dao_id,
    proposal_id,
    proposalParamsHash,
    proposed_voting_system,
    proposed_vs_params_hash,
    voting_system.address,
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

  const transactions = [createTransaction];

  if (proposalParamsTx) {
    transactions.push(proposalParamsTx)
  }

  if (is_add) {
    const feeReferenceParamsTransaction = 1_000_000;
    const referenceParamsTransaction = Transaction.createTransaction(
      publicKey,
      WalletAdapterNetwork.TestnetBeta,
      voting_system.program_id,
      "reference_voting_system_params",
      [inputVSParams],
      feeReferenceParamsTransaction,
      false
    );
    const notReferencedYet = (
      null == await getMappingValue(
        voting_system.program_id,
        "voting_system_params",
        proposed_vs_params_hash
      )
    );
    if (notReferencedYet) {
      transactions.push(referenceParamsTransaction);
    }
  }

  await requestBulkTransactions(transactions);
}



export const updateDaoManager = async (
  dao,
  publicKey,
  requestTransaction,
  daoId,
  tokenId,
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
    tokenId,
    daoManagerUpdater,
    votingSystemManager
  ];
  if (proposersManager != null) {
    parsedInputs.push(proposersManager)
  }

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


export const createDaoUpdateProposal = async (
  dao,
  publicKey,
  requestBulkTransactions,
  daoId,
  tokenId,
  daoManager,
  daoManagerUpdater,
  votingSystemManager,
  proposersManager,
  votingSystem,
  votingSystemParamsHash,
  proposalBlocks
) => {
  const formerDaoManager = dao?.dao_manager?.program_id;
  const programId = process.env.NEXT_PUBLIC_H_UPDATE_DAOM_PROGRAM_ID;

  const from = (
    formerDaoManager === process.env.NEXT_PUBLIC_DAOM_APL_PROGRAM_ID
  ) ? "ap" : "na";
  const to = (
    daoManager === process.env.NEXT_PUBLIC_DAOM_APL_PROGRAM_ID
  ) ? "ap" : "na";

  const functionName = `propose_update_${from}_to_${to}`;
  const fee = 1_000_000;

  const [proposalParamsHash, proposalParamsTx] = await getProposalParamsTx(
    publicKey,
    votingSystem.program_id,
    proposalBlocks
  );

  const proposalId = random_from_type("field");
  let parsedInputs = [
    daoId,
    proposalId,
    proposalParamsHash,
    tokenId,
    daoManagerUpdater,
    votingSystemManager
  ];

  if (proposersManager != null) {
    parsedInputs.push(proposersManager)
  }
  parsedInputs = parsedInputs.concat([
    votingSystem.address,
    votingSystemParamsHash
  ]);

  console.log({ parsedInputs });

  const createTransaction = Transaction.createTransaction(
    publicKey,
    WalletAdapterNetwork.TestnetBeta,
    programId,
    functionName,
    parsedInputs,
    fee,
    false
  );

  const transactions = [
    createTransaction,
  ];
  if (proposalParamsTx) {
    transactions.push(proposalParamsTx)
  }

  await requestBulkTransactions(transactions);
}

// addApprovedProposer
// daom__approved_proposers_003.aleo/add_approved_proposer


export const castVote = async (
  publicKey,
  requestTransaction,
  votingSystemProgramId,
  daoId,
  amount,
  proposalId,
  forVote,
  tokenRecord,
) => {
  const programId = votingSystemProgramId;
  const functionName = `cast_vote`;
  const fee = 1_000_000;

  const candidate = forVote ? "1field" : "0field";

  let parsedInputs = [
    daoId,
    proposalId,
    tokenRecord?.data?.amount.split(".")[0],
    candidate,
    tokenRecord
  ];

  console.log({ parsedInputs });

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



export const withdrawReceipt = async (
  publicKey,
  requestTransaction,
  votingSystemProgramId,
  receiptRecord,
) => {
  const programId = votingSystemProgramId;
  const functionName = `withdraw_receipt`;
  const fee = 1_000_000;


  let parsedInputs = [
    receiptRecord?.data?.amount.split(".")[0],
    receiptRecord,
  ];

  console.log({ parsedInputs });

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


export const setResult = async (
  publicKey,
  requestTransaction,
  votingSystemProgramId,
  daoId,
  proposalId,
  winner
) => {
  const programId = votingSystemProgramId;
  const functionName = `set_result`;
  const fee = 1_000_000;

  let parsedInputs = [
    daoId,
    proposalId,
    winner
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


export const applyUpdate = async (
  publicKey,
  requestTransaction,
  proposal,
  updateDaoParamsRef
) => {
  if (proposal.type === "psu") {
    return await applyPsUpdateProposal(
      publicKey,
      requestTransaction,
      proposal
    );
  }
  if (proposal.type === "vsu") {
    return await applyVsUpdateProposal(
      publicKey,
      requestTransaction,
      proposal
    );
  }
  if (proposal.type === "daou") {
    return await applyDaoUpdateProposal(
      publicKey,
      requestTransaction,
      proposal,
      updateDaoParamsRef
    );
  }
}


export const applyPsUpdateProposal = async (
  publicKey,
  requestTransaction,
  proposal
) => {
  const programId = proposal.content.program_id;
  const isAdd = proposal.content.value.is_add === "true";

  const functionName = isAdd ? `add_approved_proposer` : `remove_approved_proposer`;
  const fee = 1_000_000;

  const parsedInputs = [
    proposal.dao_id,
    proposal.proposal_id,
    proposal.content.value.proposer.address
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


export const applyVsUpdateProposal = async (
  publicKey,
  requestTransaction,
  proposal
) => {
  const programId = proposal.content.program_id;
  const isAdd = proposal.content.value.is_add === "true";

  const functionName = isAdd ? `add_voting_system` : `remove_voting_systemr`;
  const fee = 1_000_000;

  const parsedInputs = [
    proposal.dao_id,
    proposal.proposal_id,
    proposal.content.value.voting_system.address,
    proposal.content.value.vs_params_hash
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


export const applyDaoUpdateProposal = async (
  publicKey,
  requestTransaction,
  proposal,
  updateDaoParamsRef
) => {
  const formerDaoManager = await addressToProgramId(proposal.dao?.dao_manager);
  const newDaoManager = updateDaoParamsRef.current.dao_manager;

  const programId = process.env.NEXT_PUBLIC_H_UPDATE_DAOM_PROGRAM_ID;

  const from = (
    formerDaoManager === process.env.NEXT_PUBLIC_DAOM_APL_PROGRAM_ID
  ) ? "ap" : "na";
  const to = (
    newDaoManager === process.env.NEXT_PUBLIC_DAOM_APL_PROGRAM_ID
  ) ? "ap" : "na";
  const functionName = `dao_based_update_${from}_to_${to}`;
  const fee = 1_000_000;

  let parsedInputs = [
    proposal.dao_id,
    proposal.proposal_id,
  ]
  if (functionName === "dao_based_update_ap_to_na" && process.env.NEXT_PUBLIC_DAOM_APL_PROGRAM_ID === "daom__approved_proposers_015.aleo") {
    parsedInputs.push("0field")
  } // TODO Remove in Prod
  parsedInputs = parsedInputs.concat([proposal.content.value.token_id,
  updateDaoParamsRef.current.dao_manager_updater,
  updateDaoParamsRef.current.voting_system_manager
  ]);
  if (updateDaoParamsRef.current.proposers_manager != null) {
    parsedInputs.push(updateDaoParamsRef.current.proposers_manager)
  }

  console.log({ parsedInputs, functionName })
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
