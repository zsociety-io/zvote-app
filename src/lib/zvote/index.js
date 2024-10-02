import { listProgramMappingValues, getStatus, getMappingValue, addressToProgramId } from "@/lib/aleo/aleoscan";
import { formatAleoString, getUserBalance, getTokenData, hashStruct, hashStructToAddress } from "@/lib/aleo";
import { programIdToAddress } from "@/lib/aleo";
import prettier from "prettier";
import { stringToFieldList } from "@/lib/aleo/string"
import { dynamodb_update, dynamodb_get } from "@/lib/externals/aws/dynamodb";


export const getAddressDaos = async (publicKey) => {
  const daos = await getAllDaos();

  const ownedTokens = await getUserTokens(
    publicKey,
    daos.map(dao => dao.token_id)
  );
  for (const dao of daos) {
    dao.token = ownedTokens?.[dao.token_id];
    console.log(dao.token);
  }
  const owned_daos = daos.filter(
    dao => (
      dao.token.balance != null && dao.token.balance.balance > 0
      || dao?.dao_manager?.address === publicKey
      || dao?.dao_manager?.dao_manager_updater?.address === publicKey
      || dao?.dao_manager?.voting_system_manager?.address === publicKey
      || dao?.proposers_manager?.address === publicKey
    )
  );
  return owned_daos;
}

const getDaoProposers = async (dao, daoId) => {
  const proposers_mapping_values = await listProgramMappingValues(
    process.env.NEXT_PUBLIC_DAOM_APL_PROGRAM_ID,
    "approved_proposers"
  );
  const proposers = await Promise.all(
    proposers_mapping_values
      .map(
        ({ key, value }) => {
          const proposer = JSON.parse(formatAleoString(value));
          return {
            dao_id: proposer.dao_id,
            address: proposer.proposer
          };
        }
      )
      .filter(
        (proposer) => (proposer.dao_id === daoId)
      )
      .map(
        async (proposer) => {
          return {
            ...proposer,
            program_id: await addressToProgramId(proposer.address)
          };
        }
      )
  );
  return proposers;
}


export const getDao = async (daoId) => {
  const daos = await getAllDaos([daoId]);
  const dao = daos?.[0] || null;
  if (dao != null) {
    dao.voting_systems = await getDaoVotingSystems(daoId);
    dao.proposals = await getAllProposals(daoId, dao.voting_systems);
    if (dao?.dao_manager?.program_id === process.env.NEXT_PUBLIC_DAOM_APL_PROGRAM_ID) {
      dao.dao_manager.proposers = await getDaoProposers(dao, daoId);
    }
  }
  return dao;
}


const cachedAddressToProgramId = {};
const cachedHashToParams = {};

const getVotingSystem = async (voting_system) => {
  const address = voting_system.address;
  if (cachedAddressToProgramId?.[address] == null) {
    cachedAddressToProgramId[address] =
      await addressToProgramId(address);
  }
  const program_id = cachedAddressToProgramId?.[address];

  if (cachedHashToParams?.[voting_system.params_hash] == null) {
    cachedHashToParams[voting_system.params_hash] =
      await getMappingValue(
        program_id,
        "voting_system_params",
        voting_system.params_hash,
      );
  }
  const params_str = cachedHashToParams?.[voting_system.params_hash];

  const params = JSON.parse(formatAleoString(params_str));
  delete voting_system.dao_id;
  return {
    ...voting_system,
    program_id,
    params,
    params_str
  };
}



export const getProposalVote = async (proposal) => {
  const score_key_0 = hashStruct(`{
    dao_id: ${proposal.dao_id},
    proposal_id: ${proposal.proposal_id},
    candidate: 0field
  }`);
  const score_key_1 = hashStruct(`{
    dao_id: ${proposal.dao_id},
    proposal_id: ${proposal.proposal_id},
    candidate: 1field
  }`)
  const [score_0_str, score_1_str, params_str, status, result] = await Promise.all([
    getMappingValue(
      proposal?.voting_system?.program_id,
      "scores",
      score_key_0
    ) || null,
    getMappingValue(
      proposal?.voting_system?.program_id,
      "scores",
      score_key_1
    ) || null,
    getMappingValue(
      proposal?.voting_system?.program_id,
      "proposal_params",
      proposal?.params_hash
    ) || null,
    getStatus(),
    getMappingValue(
      process.env.NEXT_PUBLIC_MDSP_PROGRAM_ID,
      "results",
      proposal.proposal_key_hash
    ) || null,
  ]);
  const score_0 = score_0_str ? Number(score_0_str.slice(0, -4)) : 0;
  const score_1 = score_1_str ? Number(score_1_str.slice(0, -4)) : 0;
  const params = params_str ? JSON.parse(formatAleoString(params_str)) : null;
  let executed = false;
  if (result != null && proposal?.content?.program_id) {
    try {
      executed = await getMappingValue(
        proposal.content.program_id,
        "executed_already",
        score_key_0
      ) || false;
    } catch (e) { }
  }

  const end_block = params?.end_block ? Number(params?.end_block.slice(0, -3)) : 100000000000000;
  const ended = end_block <= status.latest_block_height;
  return {
    scores: { score_0, score_1 },
    end: {
      block: end_block,
      ended
    },
    result,
    executed
  };
}

export const getDaoVotingSystems = async (daoId) => {
  const voting_system_mapping_values = await listProgramMappingValues(
    process.env.NEXT_PUBLIC_MDSP_PROGRAM_ID,
    "voting_systems"
  );

  const voting_systems = voting_system_mapping_values
    .map(
      ({ key, value }) => {
        const vs = JSON.parse(formatAleoString(value));
        return {
          dao_id: vs.dao_id,
          address: vs.voting_system,
          params_hash: vs.vs_params_hash,
          key_hash: key
        };
      }
    )
    .filter(
      (vs) => (vs.dao_id === daoId)
    );

  const loaded_voting_systems = await Promise.all(
    voting_systems.map(getVotingSystem)
  )
  return loaded_voting_systems;
}

const getProposalContent = async (proposal) => {
  const contentProgramId = await addressToProgramId(proposal.content);
  if (contentProgramId == null) {
    const saved_content = await dynamodb_get(
      process.env.AWS_DYNAMO_DB_PROPOSAL_CONTENTS_TABLE,
      { aleo_address: proposal.content },
    );
    if (saved_content === null) {
      return {
        value: proposal.content,
        value_str: proposal.content,
        program_id: null,
        address: null
      };
    }
    return {
      value: saved_content.proposal_content,
      value_str: saved_content.proposal_content,
      program_id: null,
      address: null
    };
  }
  const value_str = await getMappingValue(
    contentProgramId,
    "proposal_contents",
    proposal.proposal_key_hash
  );
  let value = null;
  try {
    value = JSON.parse(formatAleoString(value_str));
  } catch (e) { }

  return {
    program_id: contentProgramId,
    address: proposal.content,
    value_str,
    value
  }
}

const getProposalStatus = async (proposal) => {
  const result = await getMappingValue(
    process.env.NEXT_PUBLIC_MDSP_PROGRAM_ID,
    "results",
    proposal.proposal_key_hash
  ) || null;
  if (result == null) {
    return "pending";
  }
  if (result === "0field") {
    return "rejected";
  }
  if (result === "1field") {
    return "accepted";
  }
}


export const getAllProposals = async (daoId) => {
  const proposals_mapping_values = await listProgramMappingValues(
    process.env.NEXT_PUBLIC_MDSP_PROGRAM_ID,
    "proposals"
  );
  const proposals = await Promise.all(
    proposals_mapping_values
      .map(
        ({ key, value }) => ({
          ...JSON.parse(formatAleoString(value)),
          proposal_key_hash: key,
        })
      )
      .filter(
        (proposal) => proposal.dao_id === daoId
      )
      .map(loadProposal)
  );
  return proposals;
}


const loadProposal = async (proposal) => {
  const vs_params_hash = proposal.vs_params_hash;
  delete proposal.vs_params_hash;
  const voting_system = await getVotingSystem({
    address: proposal.voting_system,
    params_hash: vs_params_hash,
  });
  proposal.voting_system = voting_system;
  const [content, status] = await Promise.all([
    getProposalContent(proposal),
    getProposalStatus(proposal)
  ]);
  const pid = content.program_id;
  const type = (
    pid === process.env.NEXT_PUBLIC_VSM_DAO_BASED_NAR_PROGRAM_ID
    || pid === process.env.NEXT_PUBLIC_VSM_DAO_BASED_APL_PROGRAM_ID
  ) ?
    "vsu" :
    (
      pid === process.env.NEXT_PUBLIC_DAOMU_DAO_BASED_AP_PROGRAM_ID
      || pid === process.env.NEXT_PUBLIC_DAOMU_DAO_BASED_NA_PROGRAM_ID
    ) ?
      "daou" :
      pid === process.env.NEXT_PUBLIC_PSM_DAO_BASED_PROGRAM_ID ?
        "psu"
        :
        "default";
  return {
    ...proposal,
    content,
    type,
    status,
  }
}


export const getProposal = async (daoId, proposalId) => {
  const proposal_key = `{dao_id: ${daoId}, proposal_id: ${proposalId}}`
  const proposal_key_hash = hashStruct(proposal_key);
  const proposal_mapping_value = await getMappingValue(
    process.env.NEXT_PUBLIC_MDSP_PROGRAM_ID,
    "proposals",
    proposal_key_hash
  );

  if (proposal_mapping_value == null) {
    return null;
  }
  const proposal = {
    proposal_key_hash,
    ...JSON.parse(formatAleoString(proposal_mapping_value)),
  };
  return await loadProposal(proposal);
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


export const getAllDaos = async (daoIdFilterList) => {
  const dao_mapping_values = await listProgramMappingValues(
    process.env.NEXT_PUBLIC_MDSP_PROGRAM_ID,
    "daos"
  );
  const daos = Object.fromEntries(
    dao_mapping_values
      .filter(
        ({ key, value }) => (
          daoIdFilterList == null || daoIdFilterList.includes(key)
        )
      )
      .map(
        ({ key, value }) => ([
          key, JSON.parse(formatAleoString(value))
        ])
      )
  );
  return await Promise.all(Object.values(daos).map(loadManagers));
}


export const loadManagers = async (dao) => {
  dao.dao_manager = {
    address: dao.dao_manager,
    program_id: await addressToProgramId(dao.dao_manager),
    params_hash: dao.dao_manager_params_hash,
  };
  if (dao.dao_manager.program_id == null) {
    return dao;
  }
  const dao_manager_params = await getMappingValue(
    dao.dao_manager.program_id,
    "dao_manager_params",
    dao.dao_manager_params_hash
  );
  if (dao_manager_params == null) { return }
  dao.dao_manager.params_str = dao_manager_params;
  dao.dao_manager.params = JSON.parse(formatAleoString(dao_manager_params));

  delete dao.dao_manager_params_hash;

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
  const dao_manager_updater_address = dao.dao_manager.params.dao_manager_updater;
  dao.dao_manager.dao_manager_updater = {
    address: dao_manager_updater_address,
    program_id: await addressToProgramId(dao_manager_updater_address)
  };
}

export const loadVotingSystemManager = async (dao) => {
  const voting_system_manager_address = dao.dao_manager.params.voting_system_manager;
  dao.dao_manager.voting_system_manager = {
    address: voting_system_manager_address,
    program_id: await addressToProgramId(voting_system_manager_address)
  };
}

export const loadAPLDao = async (dao) => {
  const proposers_manager_address = dao.dao_manager.params.proposers_manager;
  dao.dao_manager.proposers_manager = {
    address: proposers_manager_address,
    program_id: await addressToProgramId(proposers_manager_address)
  };
}


export const referenceProposalContent = async (content) => {
  const formated = await prettier.format(content, { parser: "markdown" });
  const hash = hashStructToAddress(stringToFieldList(formated));
  await dynamodb_update(
    process.env.AWS_DYNAMO_DB_PROPOSAL_CONTENTS_TABLE,
    { aleo_address: hash },
    { proposal_content: formated }
  );
  return { formated, hash };
}