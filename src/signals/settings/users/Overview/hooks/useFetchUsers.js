import { useState, useEffect } from 'react';

import { PAGE_SIZE as page_size } from 'containers/App/constants';
import configuration from 'shared/services/configuration/configuration';
import useFetch from 'hooks/useFetch';

import filterData from '../../../filterData';

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
const useFetchUsers = ({ page, filters } = {}) => {
  const [users, setUsers] = useState([]);
  const { get, data, isLoading, error } = useFetch();

  useEffect(() => {
    const pageParams = { page, page_size };

    const filterParams = Object.entries(filters || {})
      .filter(([, value]) => value !== '*')
      .reduce((acc, [filter, value]) => ({ ...acc, [filter]: value }), {});

    const queryParams = { ...pageParams, ...filterParams };

    get(configuration.USERS_ENDPOINT, queryParams);
  }, [filters, get, page]);

  useEffect(() => {
    if (!data) return;

    const filteredUserData = filterData(data.results, colMap);

    setUsers({ count: data.count, list: filteredUserData });
  }, [data]);

  return { isLoading, users, error };
};

export default useFetchUsers;
