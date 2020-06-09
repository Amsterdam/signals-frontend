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

  useEffect(
    () => () => {
      controller.abort();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const get = async (url, params, requestOptions = {}) => {
    setLoading(true);

    const arrayParams = Object.entries(params || {})
      .filter(([key]) => Array.isArray(params[key]))
      .flatMap(([key, value]) => value.flatMap(val => `${key}=${val}`));

    const scalarParams = Object.entries(params || {})
      .filter(([, value]) => Boolean(value))
      .filter(([key]) => !Array.isArray(params[key]))
      .reduce((acc, [key, value]) => [...acc, `${key}=${value}`], []);

    const queryParams = arrayParams.concat(scalarParams).join('&');
    const requestURL = [url, queryParams].filter(Boolean).join('?');

    try {
      const fetchResponse = await fetch(requestURL, {
        headers: requestHeaders,
        method: 'GET',
        signal,
        ...requestOptions,
      });
      /* istanbul ignore else */
      if (fetchResponse.ok === false) {
        throw fetchResponse;
      }

      let responseData;

      if (requestOptions.responseType === 'blob') {
        responseData = await fetchResponse.blob();
      } else {
        responseData = await fetchResponse.json();
      }

      setData(responseData);
    } catch (exception) {
      Object.defineProperty(exception, 'message', {
        value: getErrorMessage(exception),
        writable: false,
      });

      setError(exception);
    } finally {
      setLoading(false);
    }
  };

  const modify = method => async (url, modifiedData, requestOptions = {}) => {
    setLoading(true);

    try {
      const modifyResponse = await fetch(url, {
        headers: requestHeaders,
        method,
        signal,
        body: JSON.stringify(modifiedData),
        ...requestOptions,
      });

      /* istanbul ignore else */
      if (modifyResponse.ok === false) {
        throw modifyResponse;
      }

      let responseData;

      if (requestOptions.responseType === 'blob') {
        responseData = await modifyResponse.blob();
      } else {
        responseData = await modifyResponse.json();
      }

      setData(responseData);
      setSuccess(true);
    } catch (exception) {
      Object.defineProperty(exception, 'message', {
        value: getErrorMessage(exception),
        writable: false,
      });

      setError(exception);
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
