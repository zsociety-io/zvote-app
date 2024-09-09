export const post_request = async (url, body) => {
  return await request('POST', url, body);
}


export const get_request = async (url, body) => {
  return await request('GET', url, body);
}


export const delete_request = async (url, body) => {
  return await request('DELETE', url, body);
}

export const put_request = async (url, body) => {
  return await request('PUT', url, body);
}


export const patch_request = async (url, body) => {
  return await request('PATCH', url, body);
}

export const request = async (method, url, body) => {
  const requestOptions = {
    method: method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (body)
    requestOptions.body = JSON.stringify(body);

  let error = null;
  let result = null;
  const unkownError = "Unknown server error.";
  try {
    const response = await fetch(url, requestOptions);
    result = await response.json();
    if (!response.ok) {
      error = result?.error || unkownError;
    }
  } catch (e) {
    error = unkownError;
  }
  if (error != null) {
    throw new Error(error);
  }
  return result;
}