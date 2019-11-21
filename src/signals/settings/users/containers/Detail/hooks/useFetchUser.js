import { useState, useEffect } from 'react';
import { getAuthHeaders, getErrorMessage } from 'shared/services/auth/auth';
import { USERS_ENDPOINT } from 'shared/services/api/api';

/**
 * Custom hook useFetchUser
 *
 * Will call private /users endpoint for both GET and PATCH
 *
 * @returns {FetchResponse}
 */
const useFetchUser = id => {
  const [isLoading, setLoading] = useState();
  const [isSuccess, setSuccess] = useState();
  const initialState = id ? undefined : {};
  const [data, setData] = useState(initialState);
  const [error, setError] = useState(false);

  const url = [USERS_ENDPOINT, id].join('/');

  const controller = new AbortController();
  const { signal } = controller;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      try {
        const response = await fetch(url, {
          headers: getAuthHeaders(),
          signal,
        });

        /* istanbul ignore else */
        if (response.ok === false) {
          throw response;
        }

        const userData = await response.json();

        setData(userData);
      } catch (e) {
        e.message = getErrorMessage(e);
        setError(e);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchData();
    }

    return () => {
      controller.abort();
    };
  }, []);

  const patch = async patchData => {
    setLoading(true);

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        method: 'PATCH',
        signal,
        body: JSON.stringify(patchData),
      });

      /* istanbul ignore else */
      if (response.ok === false) {
        throw response;
      }

      const userData = await response.json();

      setSuccess(true);
      setData(userData);
    } catch (e) {
      e.message = getErrorMessage(e);

      setSuccess(false);
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  /**
   * @typedef {Object} FetchResponse
   * @property {Boolean} isLoading - Indicator of fetch state
   * @property {Boolean} isSuccess - Indicator of request completion
   * @property {Object} data - User object
   * @property {Error} error - Error object thrown during fetch and data parsing
   * @property {Function} patch - Function that expects the user data object as parameter
   */
  return { isLoading, isSuccess, data, error, patch };
};

export default useFetchUser;
