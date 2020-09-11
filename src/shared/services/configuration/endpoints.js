import endpoints from './endpoint-definitions';

export const prefixEndpoints = (apiBaseUrl = '') => {
  const prefix = apiBaseUrl === null || apiBaseUrl === undefined ? '' : apiBaseUrl;
  return Object.entries(endpoints).reduce((acc, [key, value]) => {
    acc[key] = `${prefix}${value}`;
    return acc;
  }, {});
};
