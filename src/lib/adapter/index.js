import {
  Transaction,
  WalletAdapterNetwork,
} from '@demox-labs/aleo-wallet-adapter-base';
import { random_from_type, } from "@/lib/aleo/index.js";


export const createDao = async (
  publicKey,
  token_id,
  requestTransaction,
  initial_voting_system,
  initial_vs_params_hash,
  dao_manager_updater,
  voting_system_manager,
  no_approval_required,
  proposal_manager
) => {
  const programId = "zvote_dao_factory.aleo";
  const functionName = no_approval_required ?
    'register_any_proposer_dao' :
    'register_proposer_list_dao';
  const fee = no_approval_required ?
    1_000_000 :
    1_000_000;
  const dao_id = random_from_type("field");

  const parsedInputs = [
    dao_id,
    token_id,
    initial_voting_system,
    initial_vs_params_hash,
    dao_manager_updater,
    voting_system_manager,
  ];
  if (!no_approval_required) {
    parsedInputs.push(
      proposal_manager
    );
  }

  const aleoTransaction = Transaction.createTransaction(
    publicKey,
    WalletAdapterNetwork.TestnetBeta,
    programId,
    functionName,
    parsedInputs,
    fee,
    false
  );
  await requestTransaction(aleoTransaction);
}