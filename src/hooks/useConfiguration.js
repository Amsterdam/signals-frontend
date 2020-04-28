

const useConfiguration = () => ({
  // should get custom validation (TS?)
  urls: global.config.urls,
  maps:  global.config.maps,
});

export default useConfiguration;
