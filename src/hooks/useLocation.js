import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const useLocationHook = () => {
  const location = useLocation();

  const isFrontOffice = useMemo(
    () =>
      !location.pathname.startsWith('/manage') &&
      !location.pathname.startsWith('/instellingen'),
    [location.pathname]
  );

  return { location, isFrontOffice };
};

export default useLocationHook;
