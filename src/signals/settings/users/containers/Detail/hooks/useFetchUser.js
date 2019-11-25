import { useState, useEffect } from 'react';

import CONFIGURATION from 'shared/services/configuration/configuration';
import { getAuthHeaders } from 'shared/services/auth/auth';

export const userEndpoint = `${CONFIGURATION.API_ROOT}signals/v1/private/users/`;

/**
 * Custom hook useFetchUser
 *
 * Will call private /users endpoint
 *
 * @returns {FetchResponse}
 */
const useFetchUser = id => {
  const [isLoading, setLoading] = useState();
  const [data, setData] = useState();
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function fetchData() {
      setLoading(true);

      try {
        const url = [userEndpoint, id].join('');
        const response = await fetch(url, {
          headers: getAuthHeaders(),
          signal,
        });
        const userData = await response.json();

        setData(userData);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    return (() => {
      controller.abort();
    });
  }, []);

  /**
   * @typedef {Object} FetchResponse
   * @property {Boolean} isLoading - Indicator of fetch state
   * @property {Object} data - User object
   * @property {Error} error - Error object thrown during fetch and data parsing
   */
  return { isLoading, data, error };
};

export default useFetchUser;
