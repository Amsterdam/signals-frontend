const useConfiguration = () => {
  const API_ROOT = window.API_ROOT;

  return {
    SITE: {
      LANG: 'nl',
      MOBILE_WEB_APP_TITLE: '',
      TITLE: 'SIA (Signalen Informatievoorziening Amsterdam)',
    },
    ENDPOINTS: {
      USERS: `${API_ROOT}signals/v1/private/users/`,
    },
    MAPS: {
      GEMEENTE_NAAM: window.GEMEENTE_NAAM,
      BOUNDS: window.BOUNDS,
      LOCK_TO_BOUNDS: true,
    },
  };
};

export default useConfiguration;
