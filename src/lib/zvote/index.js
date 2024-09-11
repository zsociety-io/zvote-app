import { listProgramMappingValues } from "lib/aleo/aleoscan";
import { formatAleoString } from "@/lib/aleo";
import { programIdToAddress } from "@/lib/aleo";


const daoManagerPrograms = [
  process.env.NEXT_PUBLIC_DAOM_APL_PROGRAM_ID,
  process.env.NEXT_PUBLIC_DAOM_NAR_PROGRAM_ID
];

export const daoManagers = Object.fromEntries(
  daoManagerPrograms.map(
    (daoManagerProgram) => (
      [programIdToAddress(daoManagerProgram), daoManagerProgram]
    )
  )
);


export const getAddressDaos = async (publicKey) => {
  const daos = await getAllDaos();
  console.log(daos)
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
          dao_key_hash: key,
        }
      ])
    )
  );
  const voting_systems = Object.fromEntries(
    voting_system_mapping_values.map(
      ({ key, value }) => ([
        key, {
          ...JSON.parse(formatAleoString(value)),
          voting_system_key_hash: key,

        }
      ])
    )
  );
  console.log(daos)
  console.log(voting_systems)
  await Promise.all(daos.map(loadDao));
  return daos;
}

/*
dao = {
  dao_id,
  token_id,
  dao_manager,
  dao_key_hash
}
*/

export const loadDao = async (dao) => {
  const manager = daoManagers?.[dao.dao_manager] || dao.dao_manager;
  dao.managerIsStandard = daoManagers?.[dao.dao_manager] == null;
  dao.manager = manager;
  if (manager == null) {
    return dao;
  }
  if (manager === process.env.NEXT_PUBLIC_DAOM_APL_PROGRAM_ID) {
    await loadAPLDao(dao);
  }
  return dao;
}


export const loadAPLDao = async (dao) => {

}