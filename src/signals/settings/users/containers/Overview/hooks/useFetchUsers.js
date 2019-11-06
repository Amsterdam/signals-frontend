import { useState, useEffect } from 'react';

import CONFIGURATION from 'shared/services/configuration/configuration';
import { getAuthHeaders } from 'shared/services/auth/auth';

import filterData from './filterData';

export const usersEndpoint = `${CONFIGURATION.API_ROOT}signals/v1/private/users`;

/**
 * Custom hook useFetchUsers
 *
 * Will call private /users endpoint
 *
 * @returns {FetchResponse}
 */
const useFetchUsers = ({ page = 1, pageSize } = {}) => {
  const [isLoading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      try {
        const params = [
          page && `page=${page}`,
          pageSize && `page_size=${pageSize}`,
        ]
          .filter(Boolean)
          .join('&');
        const url = [usersEndpoint, params].filter(Boolean).join('/?');
        const response = await fetch(url, {
          headers: getAuthHeaders(),
        });
        const userData = await response.json();
        const filteredUserData = filterData(userData.results);

        setUsers(filteredUserData);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [page]);

  /**
   * @typedef {Object} FetchResponse
   * @property {Boolean} isLoading - Indicator of fetch state
   * @property {Object[]} users - Array of user objects
   * @property {Error} error - Error object thrown during fetch and data parsing
   */
  return { isLoading, users, error };
};

export default useFetchUsers;
