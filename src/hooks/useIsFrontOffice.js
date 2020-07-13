import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const useIsFrontOffice = () => {
  const location = useLocation();

  return useMemo(
    () =>
      !location.pathname.startsWith('/manage') &&
      !location.pathname.startsWith('/instellingen'),
    [location.pathname]
  );
};

export default useIsFrontOffice;
