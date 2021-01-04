import { useEffect, useMemo } from 'react';

import { isAuthenticated } from 'shared/services/auth/auth';
import configuration from 'shared/services/configuration/configuration';

import useFetch from './useFetch';

const useUsers = () => {
  const users = useFetch();

  const userOptions = useMemo(
    () =>
      configuration.featureFlags.assignSignalToEmployee &&
      users.data?.results && [
        {
          key: null,
          value: 'Niet toegewezen',
        },
        ...users.data.results.map(user => ({
          key: user.username,
          value: user.username,
        })),
      ],
    [users]
  );

  useEffect(() => {
    if (isAuthenticated() && !users.isLoading && !users.data) {
      users.get(configuration.USERS_ENDPOINT);
    }
  }, [users]);

  return {
    users: users.data?.results,
    userOptions,
    error: users.error,
    isLoading: users.isLoading,
    isSuccess: users.isSuccess,
  };
};

export default useUsers;
