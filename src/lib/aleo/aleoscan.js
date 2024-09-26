

export const listProgramMappingValues = async (
  programId,
  mappingId
) => {
  let cursor = null;
  const count = 50;
  let result = [];
  while (true) {
    const url = (
      `${process.env.NEXT_PUBLIC_ALEOSCAN_API_URL}/mapping/list_program_mapping_values/`
      + `${programId}/${mappingId}`
      + `?count=${count}`
      + (cursor != null ? `&cursor=${cursor}` : ``)
    );
    const page = await (await fetch(url)).json();
    if (page.result != null) {
      result = result.concat(
        page.result
      );
    }
    if (!page?.result || !page.result?.length) {
      return result;
    }
    cursor = page.cursor;
  }
}


export const getMappingValue = async (
  programId,
  mappingId,
  key
) => {
  try {
    const url = (
      `${process.env.NEXT_PUBLIC_ALEOSCAN_API_URL}/mapping/get_value/`
      + `${programId}/${mappingId}/${key}`

    );
    return await (await fetch(url)).json();
  } catch (e) {
    return null;
  }
}


export const addressToProgramId = async (
  address
) => {
  try {
    const url = (
      `${process.env.NEXT_PUBLIC_ALEOSCAN_API_URL}/address/program_id/`
      + `${address}`

    );
    return await (await fetch(url)).json();
  } catch (e) {
    return null;
  }
}
