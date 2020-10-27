import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { makeSelectDirectingDepartments } from './selectors';

const useDirectingDepartments = () => {
  const directingDepartments = useSelector(makeSelectDirectingDepartments);
  return useMemo(
    () => [
      { key: 'null', value: 'Verantwoordelijke afdeling' },
      ...directingDepartments.map(({ code }) => ({ key: code, value: code })),
    ],
    [directingDepartments]
  );
};

export default useDirectingDepartments;
