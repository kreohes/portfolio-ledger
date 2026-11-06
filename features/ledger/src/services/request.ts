const BASE_URL = "http://127.0.0.1:3001"

export async function call(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  let response: Response
  try {
    response = await fetch(BASE_URL + path, init)
  } catch {
    throw new Error("Cannot reach the server at " + BASE_URL)
  }

  if (!response.ok) {
    let message = "The server answered " + response.status
    try {
      const body: unknown = await response.json()
      if (
        typeof body === "object" &&
        body !== null &&
        "error" in body &&
        typeof body.error === "string"
      ) {
        message = body.error
      }
    } catch {
      // The error can be HTML instead of JSON.
    }
    throw new Error(message)
  }
  return response
}

export async function request<Reply extends object = object>(
  path: string,
  check: (value: unknown) => value is Reply,
  init?: RequestInit,
): Promise<Reply> {
  const response = await call(path, init)
  let body: unknown
  try {
    body = await response.json()
  } catch {
    throw new Error("The server did not return valid JSON")
  }
  if (!check(body)) {
    throw new Error("The server returned data with the wrong shape")
  }
  return body
}
