import { useCallback, useEffect, useReducer, useMemo } from 'react';
import { getAuthHeaders } from 'shared/services/auth/auth';
import { getErrorMessage } from 'shared/services/api/api';

const initialState = {
  data: undefined,
  error: undefined,
  isLoading: false,
  isSuccess: undefined,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload, error: false };

    case 'SET_GET_DATA':
      return { ...state, data: action.payload, isLoading: false, error: false };

    case 'SET_MODIFY_DATA':
      return { ...state, data: action.payload, isLoading: false, error: false, isSuccess: true };

    case 'SET_ERROR':
      return { ...state, isLoading: false, isSuccess: false, error: action.payload };

    /* istanbul ignore next */
    default:
      return state;
  }
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
const useFetch = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const controller = useMemo(() => new AbortController(), []);
  const { signal } = controller;
  const requestHeaders = useMemo(
    () => ({
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }),
    []
  );

  useEffect(
    () => () => {
      controller.abort();
    },
    [controller]
  );

  const get = useCallback(
    async (url, params, requestOptions = {}) => {
      dispatch({ type: 'SET_LOADING', payload: true });

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

        dispatch({ type: 'SET_GET_DATA', payload: responseData });
      } catch (exception) {
        Object.defineProperty(exception, 'message', {
          value: getErrorMessage(exception),
          writable: false,
        });

        dispatch({ type: 'SET_ERROR', payload: exception });
      }
    },
    [requestHeaders, signal]
  );

  const modify = useCallback(
    method => async (url, modifiedData, requestOptions = {}) => {
      dispatch({ type: 'SET_LOADING', payload: true });

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

        dispatch({ type: 'SET_MODIFY_DATA', payload: responseData });
      } catch (exception) {
        Object.defineProperty(exception, 'message', {
          value: getErrorMessage(exception),
          writable: false,
        });

        dispatch({ type: 'SET_ERROR', payload: exception });
      }
    },
    [requestHeaders, signal]
  );

  const post = modify('POST');
  const patch = modify('PATCH');
  const put = modify('PUT');

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
    get,
    patch,
    post,
    put,
    ...state,
  };
};

export default useFetch;
