export const ENVIRONMENTS = {
  DEVELOPMENT: 'DEVELOPMENT',
  ACCEPTANCE: 'ACCEPTANCE',
  PRODUCTION: 'PRODUCTION'
};

export const HOSTS = {
  DEVELOPMENT: 'localhost:3001',
  ACCEPTANCE: 'acc.meldingen.amsterdam.nl',
  PRODUCTION: 'meldingen.amsterdam.nl'
};

export const getEnvironment = () => {
  switch (process.env.NODE_ENV) {
    case 'production':
      return ENVIRONMENTS.PRODUCTION;
    case 'acceptance':
      return ENVIRONMENTS.ACCEPTANCE;
    default:
      return ENVIRONMENTS.DEVELOPMENT;
  }
};

const ENVIRONMENT = (process.env.NODE_ENV).toUpperCase();

export default ENVIRONMENT;
