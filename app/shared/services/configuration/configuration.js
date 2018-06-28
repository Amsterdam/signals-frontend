import ENVIRONMENT, { ENVIRONMENTS } from '../../environment';

const baseConfig = {
};

const environmentConfig = {
  [ENVIRONMENTS.PRODUCTION]: {
    API_ROOT: 'https://api.data.amsterdam.nl/',
    ROOT: 'https://data.amsterdam.nl/'
  },
  [ENVIRONMENTS.ACCEPTANCE]: {
    API_ROOT: 'https://acc.api.data.amsterdam.nl/',
    ROOT: 'https://acc.data.amsterdam.nl/'
  },
  [ENVIRONMENTS.DEVELOPMENT]: {
    API_ROOT: 'https://acc.api.data.amsterdam.nl/',
    ROOT: 'https://acc.data.amsterdam.nl/'
  }
};

const CONFIGURATION = {
  ...baseConfig,
  ...environmentConfig[ENVIRONMENT]
};

export default CONFIGURATION;
