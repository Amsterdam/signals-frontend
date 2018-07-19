import globalConfig from 'globalConfig'; // eslint-disable-line import/extensions, import/no-unresolved

const domainName = 'meldingen.amsterdam.nl';
const apiDomainName = 'api.data.amsterdam.nl';

const defaultConfig = {
  API_ROOT: `https://acc.${apiDomainName}/`,
  ROOT: 'http://localhost:3001/',
  AUTH_ROOT: 'https://acc.api.data.amsterdam.nl/',
};

const environmentConfig = () => {
  let environment;

  const hostname = window && window.location && window.location.hostname;

  if (hostname === domainName) {
    environment = {
      API_ROOT: `https://${apiDomainName}/`,
      ROOT: `https://${hostname}/`,
      AUTH_ROOT: `https://${apiDomainName}/`,
    };
  } else if (hostname === `acc.${domainName}`) {
    environment = {
      API_ROOT: `https://acc.${apiDomainName}/`,
      ROOT: `https://${hostname}/`,
      AUTH_ROOT: `https://acc.${apiDomainName}/`,
    };
  } else if (hostname === `opleiding.${domainName}`) {
    environment = {
      API_ROOT: `https://api.opleiding.${domainName}/`,
      ROOT: `https://${hostname}/`,
      AUTH_ROOT: `https://acc.${apiDomainName}/`,
    };
  } else {
    environment = defaultConfig;
  }

  return environment;
};

const CONFIGURATION = {
  // the configuration based on the domain
  ...environmentConfig(),

  // the external configuration override form environment.conf.json
  ...globalConfig
};

// console.log('environment configuration', CONFIGURATION); // eslint-disable-line no-console

export default CONFIGURATION;
