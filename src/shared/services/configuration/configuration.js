import globalConfig from 'config'; // eslint-disable-line import/no-unresolved import/extensions

const domainName = 'meldingen.amsterdam.nl';
const apiDomainName = 'api.data.amsterdam.nl';

const defaultConfig = {
  API_ROOT: `https://acc.${apiDomainName}/`,
  ROOT: 'http://localhost:3001/'
};

const environmentConfig = () => {
  let environment;

  const hostname = window && window.location && window.location.hostname;

  if (hostname === domainName) {
    environment = {
      API_ROOT: `https://${apiDomainName}/`,
      ROOT: `https://${hostname}/`
    };
  } else if (hostname === `acc.${domainName}`) {
    environment = {
      API_ROOT: `https://acc.${apiDomainName}/`,
      ROOT: `https://${hostname}/`
    };
  } else if (hostname === `opleiding.${domainName}`) {
    environment = {
      API_ROOT: `https://opleiding.${apiDomainName}/`,
      ROOT: `https://${hostname}/`
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

console.log('environment configuration', CONFIGURATION);

export default CONFIGURATION;
