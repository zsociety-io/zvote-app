import { listProgramMappingValues } from "lib/aleo/aleoscan";
import { formatAleoString } from "@/lib/aleo";
import { programIdToAddress } from "@/lib/aleo";


const daoManagerPrograms = [
  process.env.DAOM_APL_PROGRAM_ID,
  process.env.DAOM_NAR_PROGRAM_ID
];

export const daoManagers = Object.fromEntries(
  daoManagerPrograms.map(
    (daoManagerProgram) => (
      [programIdToAddress(daoManagerProgram), daoManagerProgram]
    )
  )
);


export const getAddressDaos = async (publicKey) => {
  const dao_mapping_values = await getAllDaos();
  const daos = dao_mapping_values.map(
    ({ key, value }) => ({
      ...JSON.parse(formatAleoString(value)),
      dao_key_hash: key
    })
  );
  await Promise.all()
  console.log(daos)
}


export const getAllDaos = async () => {
  const dao_mapping_values = await listProgramMappingValues(
    process.env.MDSP_PROGRAM_ID,
    "daos"
  );
  const other_mapping_values = await listProgramMappingValues(
    process.env.MDSP_PROGRAM_ID,
    "..."
  );
  const daos = dao_mapping_values.map(
    ({ key, value }) => ({
      ...JSON.parse(formatAleoString(value)),
      dao_key_hash: key,
    })
  );
  const loadedDaos = await Promise.all(daos.map(loadDao));
  return loadedDaos;
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
  if (manager === process.env.DAOM_APL_PROGRAM_ID) {
    await loadAPLDao(dao);
  }
}


export const loadAPLDao = async (dao) => {

}