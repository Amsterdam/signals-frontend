import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';
import { useState, useEffect } from 'react';
import { getAuthHeaders } from 'shared/services/auth/auth';
import { getErrorMessage } from 'shared/services/api/api';

/**
 * Custom hook useFetch
 *
 * Will take a URL and an optional object of parameters and use those to construct a request URL
 * with, call fetch and return the response.
 *
 * @param {Object} params - key/value
 * @returns {FetchResponse}
 */
export default () => {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [error, setError] = useState(false);
  const [isSuccess, setSuccess] = useState();

  const controller = new AbortController();
  const { signal } = controller;
  const requestHeaders = {
    ...getAuthHeaders(),
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  useEffect(() => () => {
    controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const get = async (url, params) => {
    setLoading(true);

    const queryParams = Object.entries(params || {})
      .filter(([, value]) => Boolean(value))
      .reduce((acc, [key, value]) => [...acc, `${key}=${value}`], [])
      .join('&');

    const requestURL = [url, queryParams].filter(Boolean).join('?');

    try {
      const response = await fetch(requestURL, {
        headers: requestHeaders,
        method: 'GET',
        signal,
      });
      /* istanbul ignore else */
      if (response.ok === false) {
        throw response;
      }

      const JSONResponse = await response.json();

      setData(JSONResponse);
    } catch (e) {
      e.message = getErrorMessage(e);
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const modify = method => async (url, modifiedData) => {
    setLoading(true);

    try {
      const response = await fetch(url, {
        headers: requestHeaders,
        method,
        signal,
        body: JSON.stringify(modifiedData),
      });

      /* istanbul ignore else */
      if (response.ok === false) {
        throw response;
      }

      const responseData = await response.json();

      setData(responseData);
      setSuccess(true);
    } catch (e) {
      e.message = getErrorMessage(e);

      setError(e);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const post = modify('POST');
  const patch = modify('PATCH');

  /**
   * @typedef {Object} FetchResponse
   * @property {Object} data - Fetch response
   * @property {Error} error - Error object thrown during fetch and data parsing
   * @property {Function} get - Function that expects a URL and a query parameter object
   * @property {Boolean} isLoading - Indicator of fetch request status
   * @property {Boolean} isSuccess - Indicator of post or patch request status
   * @property {Function} patch - Function that expects a URL and a data object as parameters
   * @property {Function} post - Function that expects a URL and a data object as parameters
   */
  return {
    data,
    error,
    get,
    isLoading,
    isSuccess,
    patch,
    post,
  };
};
