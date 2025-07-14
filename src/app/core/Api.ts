async function post(endpoint: string, params: object) {
  //   const headers = getAuthHeader();
  const body = JSON.stringify(params);
  const response = await fetch("/api/" + endpoint, {
    method: "POST",
    // headers,
    body,
    credentials: "include",
  });
  if (response.status == 401) {
    // Nav.login();
    console.log("login");
  }
  //   setSession(response);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`POST ${endpoint} failed: ${text}`);
  }
  return response.json();
}

async function streamPost(endpoint: string, params: object): Promise<any> {
  //   const headers = getAuthHeader()
  const body = JSON.stringify(params);

  const response = await fetch("/api/" + endpoint, {
    method: "POST",
    // headers,
    body,
    credentials: "include",
  });
  //   if (response.status == 401) Nav.login();
  //   setSession(response)
  if (response.status != 200 || !response.body) {
    const error = response.statusText;
    return { error };
  }
  const reader = response.body.getReader();
  return { reader };
}

// function getAuthHeader(): HeadersInit {
//   const token = Auth.getAccessToken()
//   const headers: HeadersInit = {
//     'Content-Type': 'application/json'
//   }
//   if (token) {
//     headers['Authorization'] = `Bearer ${token}`
//   }
//   return headers
// }

// function setSession(response: Response) {
//   const token = response.headers.get('access-token')
//   if (token) {
//     Auth.setAccessToken(token)
//   }
// }

export const Api = { post, streamPost };
