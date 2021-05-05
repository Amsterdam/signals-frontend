// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import 'whatwg-fetch'

type JsonResponse = Response & { jsonBody?: unknown & { message: string } }

export class ResponseError extends Error {
  public response: JsonResponse

  public message: string

  public constructor(response: JsonResponse, message = '') {
    super(response.statusText)
    this.response = response
    this.message = message
  }
}

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
function parseJSON(response: JsonResponse) {
  if (response.status === 204 || response.status === 205) {
    return null
  }

  return response.json()
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
async function checkStatus(response: Response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  }

  const jsonBody: {
    message: string
  } | null =
    response.headers.get('Content-Type') === 'application/json'
      ? await (response.json() as Promise<{
          message: string
        }>)
      : null
  if (jsonBody) {
    Object.defineProperty(response, 'jsonBody', {
      value: jsonBody,
      writable: false,
    })
  }

  throw new ResponseError(response)
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
export default async function request(
  url: string,
  options?: RequestInit
): Promise<unknown | { err: ResponseError }> {
  const fetchResponse = await fetch(url, options)

  const response = await checkStatus(fetchResponse)
  return parseJSON(response)
}
