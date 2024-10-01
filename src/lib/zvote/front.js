import { get_request } from '@/lib/utils/network.js';

export const getDao = async (daoId) => {
  return (await get_request(
    `/api/contract/dao/${daoId}`
  ));
}
