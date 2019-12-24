import { useState, useEffect } from 'react';
import { getAuthHeaders } from 'shared/services/auth/auth';
import { getErrorMessage } from 'shared/services/api/api';
import CONFIGURATION from 'shared/services/configuration/configuration';

const useFetchDepartment = id => {
  const [isLoading, setLoading] = useState();
  const [data, setData] = useState();
  const [error, setError] = useState(false);

  const url = [CONFIGURATION.DEPARTMENTS_ENDPOINT, id].filter(Boolean).join('');

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

        const departmentData = await response.json();

        setData(departmentData);
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
    // linter complains about missing deps although using `controller` and `signal` will throw this component in an endless loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return { isLoading, data, error };
};

export default useFetchDepartment;
