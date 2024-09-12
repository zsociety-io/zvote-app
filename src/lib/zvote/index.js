import { listProgramMappingValues, getMappingValue } from "lib/aleo/aleoscan";
import { formatAleoString, getUserBalance, getTokenData } from "@/lib/aleo";
import { programIdToAddress } from "@/lib/aleo";


const daoManagerPrograms = [
  process.env.NEXT_PUBLIC_DAOM_APL_PROGRAM_ID,
  process.env.NEXT_PUBLIC_DAOM_NAR_PROGRAM_ID
];

const votingSystemPrograms = [
  process.env.NEXT_PUBLIC_VS_2_CANDIDATES_PROGRAM_ID,
];

const proposersManagerPrograms = [
  process.env.NEXT_PUBLIC_PSM_DAO_BASED_PROGRAM_ID,
];

const votingSystemManagerPrograms = [
  process.env.NEXT_PUBLIC_VSM_DAO_BASED_NAR_PROGRAM_ID,
  process.env.NEXT_PUBLIC_VSM_DAO_BASED_APL_PROGRAM_ID,
];

const daoManagerUpdaterPrograms = [
  process.env.NEXT_PUBLIC_DAOMU_DAO_BASED_PROGRAM_ID,
];

export const daoManagers = Object.fromEntries(
  daoManagerPrograms.map(
    (daoManagerProgram) => (
      [programIdToAddress(daoManagerProgram), daoManagerProgram]
    )
  )
);

export const votingSystems = Object.fromEntries(
  votingSystemPrograms.map(
    (votingSystemProgram) => (
      [programIdToAddress(votingSystemProgram), votingSystemProgram]
    )
  )
);

export const proposersManagers = Object.fromEntries(
  proposersManagerPrograms.map(
    (proposersManagerProgram) => (
      [programIdToAddress(proposersManagerProgram), proposersManagerProgram]
    )
  )
);

export const votingSystemManagers = Object.fromEntries(
  votingSystemManagerPrograms.map(
    (votingSystemManagerProgram) => (
      [programIdToAddress(votingSystemManagerProgram), votingSystemManagerProgram]
    )
  )
);

export const daoManagerUpdaters = Object.fromEntries(
  daoManagerUpdaterPrograms.map(
    (daoManagerUpdaterProgram) => (
      [programIdToAddress(daoManagerUpdaterProgram), daoManagerUpdaterProgram]
    )
  )
);


export const getAddressDaos = async (publicKey) => {
  const daos = await getAllDaos();
  const ownedTokens = await getUserTokens(
    publicKey,
    daos.map(dao => dao.token_id)
  );
  for (const dao of daos) {
    dao.token = ownedTokens?.[dao.token_id];
  }
  const owned_daos = daos.filter(
    dao => (
      dao.token.balance != null && dao.token.balance > 0
      || dao?.dao_manager?.address === publicKey
      || dao?.dao_manager?.dao_manager_updater?.address === publicKey
      || dao?.dao_manager?.voting_system_manager?.address === publicKey
      || dao?.proposers_manager?.address === publicKey
    )
  );
  return owned_daos;
}


export const getUserTokens = async (publicKey, fromList) => {
  const balances = await Promise.all(
    fromList.map(
      async (token_id) => {
        return {
          token_id,
          balance: await getUserBalance(token_id, publicKey),
          token_data: await getTokenData(token_id),
        }
      }
    ),
  );
  return Object.fromEntries(
    balances.map(({ token_id, balance, token_data }) => ([token_id, {
      balance,
      token_data
    }]))
  );
}




export const getAllDaos = async () => {
  const dao_mapping_values = await listProgramMappingValues(
    process.env.NEXT_PUBLIC_MDSP_PROGRAM_ID,
    "daos"
  );
  const voting_system_mapping_values = await listProgramMappingValues(
    process.env.NEXT_PUBLIC_MDSP_PROGRAM_ID,
    "voting_systems"
  );
  const daos = Object.fromEntries(
    dao_mapping_values.map(
      ({ key, value }) => ([
        key, {
          ...JSON.parse(formatAleoString(value)),
          voting_systems: [],
        }
      ])
    )
  );
  const voting_systems =
    voting_system_mapping_values.map(
      ({ key, value }) => ({
        ...JSON.parse(formatAleoString(value)),
        voting_system_key_hash: key,
      })
    );
  for (const voting_system of voting_systems) {
    const dao = daos?.[voting_system?.dao_id];
    if (dao != null) {
      dao.voting_systems.push({
        address: voting_system.voting_system,
        program_id: votingSystems?.[voting_system.voting_system] || null,
        params_hash: voting_system.vs_params_hash,
        key_hash: voting_system.voting_system_key_hash
      });
    }
  }
  return await Promise.all(Object.values(daos).map(loadDao));
}


export const loadDao = async (dao) => {
  dao.dao_manager = {
    address: dao.dao_manager,
    program_id: daoManagers?.[dao.dao_manager] || null
  };
  if (dao.dao_manager.program_id == null) {
    return dao;
  }

  await Promise.all([
    loadDaoManagerUpdater(dao),
    loadVotingSystemManager(dao),
    (
      dao.dao_manager.program_id === process.env.NEXT_PUBLIC_DAOM_APL_PROGRAM_ID
    ) && loadAPLDao(dao),
  ])
  return dao;
}

export const loadDaoManagerUpdater = async (dao) => {
  const dao_manager_updater_address = await getMappingValue(
    dao.dao_manager.program_id,
    "dao_manager_updaters",
    dao.dao_id
  );
  dao.dao_manager.dao_manager_updater = {
    address: dao_manager_updater_address,
    program_id: daoManagerUpdaters?.[dao_manager_updater_address] || null
  };
}

export const loadVotingSystemManager = async (dao) => {
  const voting_system_manager_address = await getMappingValue(
    dao.dao_manager.program_id,
    "voting_system_managers",
    dao.dao_id
  );
  dao.dao_manager.voting_system_manager = {
    address: voting_system_manager_address,
    program_id: votingSystemManagers?.[voting_system_manager_address] || null
  };
}



export const loadAPLDao = async (dao) => {
  const proposers_manager_address = await getMappingValue(
    process.env.NEXT_PUBLIC_DAOM_APL_PROGRAM_ID,
    "proposers_managers",
    dao.dao_id
  );
  dao.dao_manager.proposers_manager = {
    address: proposers_manager_address,
    program_id: proposersManagers?.[proposers_manager_address] || null
  };
}