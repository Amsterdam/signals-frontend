import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const useIsFrontOffice = () => {
  const location = useLocation();

  const isFrontOffice = useMemo(
    () =>
      !location.pathname.startsWith('/manage') &&
      !location.pathname.startsWith('/instellingen'),
    [location.pathname]
  );

  return isFrontOffice;
};

export default useIsFrontOffice;
