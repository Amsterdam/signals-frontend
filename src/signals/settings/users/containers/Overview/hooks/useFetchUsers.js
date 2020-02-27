import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';
import { useState, useEffect } from 'react';

import { getAuthHeaders } from 'shared/services/auth/auth';
import configuration from 'shared/services/configuration/configuration';

import filterData from '../../../../filterData';

// name mapping from API values to human readable values
const colMap = {
  id: 'id',
  is_active: 'Status',
  roles: 'Rol',
  username: 'Gebruikersnaam',
};

/**
 * Custom hook useFetchUsers
 *
 * Will call private /users endpoint
 *
 * @returns {FetchResponse}
 */
const useFetchUsers = ({ page, pageSize, filters } = {}) => {
  const [isLoading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    (async function fetchData() {
      setLoading(true);

      const pageParams = [
        page && `page=${page}`,
        pageSize && `page_size=${pageSize}`,
      ];

      const filterParams = Object.entries(filters || {})
        .filter(([, value]) => Boolean(value))
        .reduce((acc, [filter, value]) => [...acc, `${filter}=${value}`], []);

      const queryParams = [
        ...pageParams,
        ...filterParams,
      ]
        .filter(Boolean)
        .join('&');

      try {
        const url = [configuration.USERS_ENDPOINT, queryParams].filter(Boolean).join('?');
        const response = await fetch(url, {
          headers: {
            ...getAuthHeaders(),
            Accept: 'application/json',
          },
          signal,
        });

        const userData = await response.json();
        const filteredUserData = filterData(userData.results, colMap);

        setUsers({ count: userData.count, list: filteredUserData });
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      controller.abort();
    };
  }, [page, pageSize, filters]);

  /**
   * @typedef {Object} FetchResponse
   * @property {Boolean} isLoading - Indicator of fetch state
   * @property {Object[]} users - Array of user objects
   * @property {Error} error - Error object thrown during fetch and data parsing
   */
  return { isLoading, users, error };
};

export default useFetchUsers;
