import {
  Transaction,
  WalletAdapterNetwork,
} from '@demox-labs/aleo-wallet-adapter-base';
import { random_from_type, } from "@/lib/aleo/front.js";
import { getMappingValue } from "@/lib/aleo/aleoscan";

export const createDao = async (
  publicKey,
  token_id,
  requestBulkTransactions,
  initial_voting_system,
  voting_system_params,
  initial_vs_params_hash,
  dao_manager_updater,
  voting_system_manager,
  no_approval_required,
  proposal_manager,
  voting_system_program_id
) => {
  const programId = process.env.NEXT_PUBLIC_DAO_FACTORY_PROGRAM_ID;
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

  const feeReferenceParamsTransaction = 1_000_000;
  const referenceParamsTransaction = Transaction.createTransaction(
    publicKey,
    WalletAdapterNetwork.TestnetBeta,
    voting_system_program_id,
    "reference_voting_system_params",
    [voting_system_params],
    feeReferenceParamsTransaction,
    false
  );
  const retrieved = await getMappingValue(
    voting_system_program_id, "voting_system_params", initial_vs_params_hash
  )

  const referencedAlready = null != retrieved;
  if (!referencedAlready) {
    transactions.push(referenceParamsTransaction);
  }

  await requestBulkTransactions(transactions);

}


/*
previous_dao_manager/update_dao_manager(dao_id, new_dao_manager)
new_dao_manager/init_as_dao_manager(
  dao_id,
  dao_manager_updater,
  voting_system_manager,
  proposers_manager
)
*/