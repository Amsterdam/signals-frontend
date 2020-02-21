import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';
import { useState, useEffect } from 'react';
import { getAuthHeaders } from 'shared/services/auth/auth';
import { getErrorMessage } from 'shared/services/api/api';

export const headers = {
  ...getAuthHeaders(),
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

/**
 * Custom hook useFetch
 *
 * Will take a URL and an optional object of parameters and use those to construct a request URL
 * with, call fetch and return the response.
 *
 * @param {Object} params - key/value
 * @returns {FetchResponse}
 */
export default (URL, params) => {
  const [isLoading, setLoading] = useState();
  const [data, setData] = useState();
  const [error, setError] = useState(false);
  const [isSuccess, setSuccess] = useState();

  const queryParams = Object.entries(params || {})
    .filter(([, value]) => Boolean(value))
    .reduce((acc, [key, value]) => [...acc, `${key}=${value}`], [])
    .join('&');

  const url = [URL, queryParams].filter(Boolean).join('?');

  const controller = new AbortController();
  const { signal } = controller;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      try {
        const response = await fetch(url, {
          headers,
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
    }

    fetchData();

    return () => {
      controller.abort();
    };
    // linter complains about missing deps although using `controller` and `signal` will throw this component in an endless loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, params]);

  const modify = method => async modifiedData => {
    setLoading(true);

    try {
      const response = await fetch(url, {
        headers,
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
   * @property {Boolean} isLoading - Indicator of fetch request status
   * @property {Boolean} isSuccess - Indicator of post or patch request status
   * @property {Function} patch - Function that expects the user data object as parameter
   * @property {Function} post - Function that expects the user data object as parameter
   */
  return {
    data,
    error,
    isLoading,
    isSuccess,
    patch,
    post,
  };
};
